import os
import sys
import signal
import subprocess
import atexit
from celery import Celery
from django.conf import settings

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HouseListing_Backend.settings')

app = Celery('HouseListing_Backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')


def start_worker_in_background():
    """Start Celery worker in the background when running the development server."""
    if 'runserver' in sys.argv and not os.environ.get('CELERY_WORKER_RUNNING'):
        # Prevent recursive worker starts
        os.environ['CELERY_WORKER_RUNNING'] = '1'
        
        def start_worker():
            worker_process = subprocess.Popen(
                [sys.executable, '-m', 'celery', '-A', 'HouseListing_Backend', 'worker', '--loglevel=info', '--concurrency=1'],
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if os.name == 'nt' else 0
            )
            
            def cleanup():
                if worker_process.poll() is None:  # Process is still running
                    if os.name == 'nt':
                        # Windows
                        import ctypes
                        ctypes.windll.kernel32.GenerateConsoleCtrlEvent(0, worker_process.pid)
                    else:
                        # Unix
                        worker_process.terminate()
                    worker_process.wait()
            
            # Register cleanup to run on exit
            atexit.register(cleanup)
            
            # Print worker output in a non-blocking way
            def print_output():
                while True:
                    output = worker_process.stdout.readline()
                    if output == '' and worker_process.poll() is not None:
                        break
                    if output:
                        print(f'[Celery Worker] {output.strip()}')
                worker_process.poll()
                
            import threading
            thread = threading.Thread(target=print_output)
            thread.daemon = True  # Thread will close when parent process exits
            thread.start()
            
            return worker_process
        
        # Start the worker
        try:
            worker_process = start_worker()
            print("\n\033[92m[Development] Started Celery worker in the background\033[0m")
            print("\033[93mTo stop the worker, press Ctrl+C in this terminal.\033[0m\n")
            
            # Start beat if needed
            if getattr(settings, 'CELERY_BEAT_SCHEDULE', None):
                beat_process = subprocess.Popen(
                    [sys.executable, '-m', 'celery', '-A', 'HouseListing_Backend', 'beat', '--loglevel=info'],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT
                )
                print("\033[92m[Development] Started Celery beat in the background\033[0m\n")
                
        except Exception as e:
            print(f"\033[91mFailed to start Celery worker: {e}\033[0m")
            if 'worker_process' in locals():
                worker_process.terminate()

# Start worker automatically in development
if 'runserver' in sys.argv and not os.environ.get('RUN_MAIN'):
    start_worker_in_background()
