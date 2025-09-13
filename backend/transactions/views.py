import json
import requests
import logging
from decimal import Decimal
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse, HttpResponse, Http404
from django.shortcuts import get_object_or_404
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Transaction
from .serializers import TransactionSerializer
from accounts.models import User
from rooms.models import Property, Room

logger = logging.getLogger(__name__)

class InitializePaymentView(APIView):
    """Initialize a Paystack payment"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        amount = request.data.get('amount')
        email = request.data.get('email', user.email)
        property_id = request.data.get('property_id')
        room_id = request.data.get('room_id')
        # lease_id = request.data.get('lease_id')  # Uncomment when Lease model is created
        callback_url = request.data.get('callback_url')
        
        try:
            amount = Decimal(amount)
            if amount <= 0:
                return Response(
                    {'error': 'Amount must be greater than zero'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            # Validate property and room exist if provided
            property_obj = None
            room_obj = None
            
            if property_id:
                try:
                    property_obj = Property.objects.get(id=property_id)
                except (Property.DoesNotExist, ValueError):
                    return Response(
                        {'error': 'Invalid property ID'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            if room_id:
                try:
                    room_obj = Room.objects.get(id=room_id)
                    # Ensure the room belongs to the property if both are provided
                    if property_obj and room_obj.property != property_obj:
                        return Response(
                            {'error': 'Room does not belong to the specified property'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except (Room.DoesNotExist, ValueError):
                    return Response(
                        {'error': 'Invalid room ID'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            # Create a transaction record
            transaction_data = {
                'user': user,
                'amount': amount,
                'property': property_obj,
                'room': room_obj,
                'metadata': {
                    'property_id': property_id,
                    'room_id': room_id,
                    # 'lease_id': lease_id,  # Uncomment when Lease model is created
                    'callback_url': callback_url,
                    'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                    'ip_address': self.get_client_ip(request)
                }
            }
            
            transaction = Transaction.objects.create(**transaction_data)
            
            # Prepare Paystack payload
            paystack_url = "https://api.paystack.co/transaction/initialize"
            headers = {
                "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
                "Content-Type": "application/json",
            }
            
            payload = {
                "email": email,
                "amount": int(amount * 100),  # Paystack uses kobo (smallest currency unit)
                "reference": str(transaction.reference),
                "callback_url": callback_url or f"{settings.FRONTEND_URL}/payment/callback",
                "metadata": {
                    "transaction_id": str(transaction.id),
                    "user_id": str(user.id),
                    "property_id": property_id,
                    "room_id": room_id,
                    # "lease_id": lease_id,  # Uncomment when Lease model is created
                }
            }
            
            # Make request to Paystack
            response = requests.post(paystack_url, headers=headers, json=payload)
            response_data = response.json()
            
            if response.status_code == 200 and response_data.get('status'):
                # Update transaction with Paystack response
                transaction.paystack_data = response_data
                transaction.save()
                
                return Response({
                    'authorization_url': response_data['data']['authorization_url'],
                    'access_code': response_data['data']['access_code'],
                    'reference': response_data['data']['reference'],
                })
            else:
                # Mark transaction as failed
                transaction.status = 'failed'
                transaction.paystack_data = response_data
                transaction.save()
                
                return Response(
                    {'error': 'Failed to initialize payment', 'details': response_data.get('message', 'Unknown error')},
                    status=status.HTTP_400_BAD_REQUEST
                )
                
        except (ValueError, TypeError) as e:
            return Response(
                {'error': 'Invalid amount provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


@csrf_exempt
@require_http_methods(['POST'])
def paystack_webhook(request):
    """Handle Paystack webhook events"""
    # Verify the request is from Paystack
    paystack_signature = request.headers.get('X-Paystack-Signature')
    if not verify_paystack_signature(request.body, paystack_signature):
        return HttpResponse(status=403)
    
    # Parse the event data
    try:
        event = json.loads(request.body)
    except json.JSONDecodeError:
        return HttpResponse(status=400)
    
    # Handle the event
    if event['event'] == 'charge.success':
        data = event['data']
        reference = data['reference']
        
        try:
            transaction = Transaction.objects.get(reference=reference)
            
            # Verify the payment with Paystack
            if verify_paystack_payment(reference, data):
                transaction.mark_as_successful(paystack_data=data)
                # TODO: Trigger any post-payment actions (e.g., update lease status, send notifications)
                return HttpResponse(status=200)
            else:
                transaction.mark_as_failed(paystack_data=data)
                return HttpResponse(status=400)
                
        except Transaction.DoesNotExist:
            return HttpResponse(status=404)
    
    return HttpResponse(status=200)


def verify_paystack_signature(payload, signature):
    """Verify that the webhook request is from Paystack"""
    import hmac
    import hashlib
    
    if not settings.PAYSTACK_SECRET_KEY or not signature:
        return False
        
    computed_signature = hmac.new(
        settings.PAYSTACK_SECRET_KEY.encode('utf-8'),
        msg=payload,
        digestmod=hashlib.sha512
    ).hexdigest()
    
    return hmac.compare_digest(computed_signature, signature)


def verify_paystack_payment(reference, webhook_data=None):
    """Verify a Paystack payment"""
    if not webhook_data:
        # If webhook data is not provided, fetch from Paystack API
        url = f"https://api.paystack.co/transaction/verify/{reference}"
        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }
        
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return False
            
        data = response.json()
        if not data.get('status'):
            return False
            
        webhook_data = data['data']
    
    # Check if payment was successful
    return (
        webhook_data.get('status') == 'success' and 
        webhook_data.get('reference') == reference
    )


class TransactionDetailView(generics.RetrieveAPIView):
    """Retrieve a transaction by reference"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    lookup_field = 'reference'
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class TransactionListView(generics.ListAPIView):
    """List all transactions for the authenticated user"""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user).order_by('-created_at')
