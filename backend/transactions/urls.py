from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'transactions'

urlpatterns = [
    # Initialize a new payment
    path('initialize/', views.InitializePaymentView.as_view(), name='initialize-payment'),
    
    # Webhook for Paystack to send payment events
    path('webhook/paystack/', views.paystack_webhook, name='paystack-webhook'),
    
    # List user's transactions
    path('', views.TransactionListView.as_view(), name='transaction-list'),
    
    # Get transaction details
    path('<str:reference>/', views.TransactionDetailView.as_view(), name='transaction-detail'),
]
