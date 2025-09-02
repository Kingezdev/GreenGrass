#!/usr/bin/env python
"""
Run Celery worker and beat for the HouseListing project.
On Windows, runs worker and beat as separate processes.
"""
import os
import sys
import platform
from pathlib import Path
import subprocess
import signal
import atexit

def start_process(command):
    """Start a subprocess and return the process object."""
    return subprocess.Popen(
        command,
        stdout=sys.stdout,
        stderr=sys.stderr,
        shell=True,
        creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if platform.system() == 'Windows' else 0
    )

def main():
    # Set the default Django settings module
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HouseListing_Backend.settings')
    
    # Add the project to the Python path
    project_root = str(Path(__file__).resolve().parent)
    if project_root not in sys.path:
        sys.path.insert(0, project_root)
    
    # Import Celery app after Django is ready
    from HouseListing_Backend.celery import app
    
    # Windows requires separate processes for worker and beat
    if platform.system() == 'Windows':
        print("Starting Celery worker and beat as separate processes (Windows)...")
        
        # Start worker
        worker_cmd = f'"{sys.executable}" -m celery -A HouseListing_Backend worker --loglevel=info --concurrency=1'
        worker_process = start_process(worker_cmd)
        print(f"Started Celery worker (PID: {worker_process.pid})")
        
        # Start beat
        beat_cmd = f'"{sys.executable}" -m celery -A HouseListing_Backend beat --loglevel=info'
        beat_process = start_process(beat_cmd)
        print(f"Started Celery beat (PID: {beat_process.pid})")
        
        # Handle cleanup on exit
        def cleanup():
            print("\nStopping Celery processes...")
            for process in [worker_process, beat_process]:
                if process.poll() is None:  # Process is still running
                    if platform.system() == 'Windows':
                        import ctypes
                        ctypes.windll.kernel32.GenerateConsoleCtrlEvent(0, process.pid)
                    else:
                        process.terminate()
                    process.wait()
            
        atexit.register(cleanup)
        
        # Keep the main process running
        try:
            print("\nCelery worker and beat are running. Press Ctrl+C to stop.")
            print("Note: You may need to press Ctrl+C multiple times to fully exit.")
            worker_process.wait()
        except KeyboardInterrupt:
            print("\nShutting down...")
            cleanup()
    else:
        # On Unix-like systems, we can use the built-in beat
        print("Starting Celery worker with beat...")
        argv = [
            'worker',
            '--loglevel=info',
            '--beat',
            '--scheduler=celery.beat:PersistentScheduler',
            '--concurrency=1',
        ]
        app.worker_main(argv)

if __name__ == '__main__':
    main()
