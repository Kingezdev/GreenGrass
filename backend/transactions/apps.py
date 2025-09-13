from django.apps import AppConfig


class TransactionsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'transactions'
    verbose_name = 'Payment Transactions'
    
    def ready(self):
        # Import signals to register them
        import transactions.signals  # noqa
