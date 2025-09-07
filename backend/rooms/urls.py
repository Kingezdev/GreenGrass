from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router for RoomViewSet
room_router = DefaultRouter()
room_router.register(r'rooms', views.RoomViewSet, basename='room')

urlpatterns = [
    # Property URLs
    path('properties/', views.PropertyListCreateView.as_view(), name='property-list-create'),
    path('properties/<int:pk>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('my-properties/', views.LandlordPropertiesView.as_view(), name='landlord-properties'),
    
    # Property Images
    path('properties/<int:property_id>/images/', views.PropertyImageUploadView.as_view(), name='property-image-upload'),
    
    # Property Rooms
    path('properties/<int:property_id>/', include(room_router.urls)),
    
    # Reviews
    path('properties/<int:property_id>/reviews/', views.PropertyReviewListCreateView.as_view(), name='property-reviews'),
    path('landlords/<int:landlord_id>/reviews/', views.LandlordReviewListCreateView.as_view(), name='landlord-reviews'),
    
    # Favorites
    path('favorites/', views.FavoriteListCreateView.as_view(), name='favorites'),
    path('favorites/<int:property_id>/', views.FavoriteDeleteView.as_view(), name='favorite-delete'),
    
    # Analytics
    path('properties/<int:property_id>/views/', views.PropertyViewListView.as_view(), name='property-views'),
]
