from django.urls import path
from . import views

urlpatterns = [
    path('conversations/', views.ConversationListCreateView.as_view(), name='conversation-list-create'),
    path('conversations/<int:pk>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
    path('conversations/<int:conversation_id>/messages/', views.MessageCreateView.as_view(), name='message-create'),
    path('start-conversation/', views.StartConversationView.as_view(), name='start-conversation'),
    path('unread-count/', views.UnreadMessagesCountView.as_view(), name='unread-count'),
]
