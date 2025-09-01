from django.urls import path
from . import views

urlpatterns = [
    path('properties/', views.PropertyListCreateView.as_view(), name='property-list-create'),
    path('properties/<int:pk>/', views.PropertyDetailView.as_view(), name='property-detail'),
    path('my-properties/', views.LandlordPropertiesView.as_view(), name='landlord-properties'),
    path('properties/<int:property_id>/images/', views.PropertyImageUploadView.as_view(), name='property-image-upload'),
    path('properties/<int:property_id>/reviews/', views.PropertyReviewListCreateView.as_view(), name='property-reviews'),
    path('landlords/<int:landlord_id>/reviews/', views.LandlordReviewListCreateView.as_view(), name='landlord-reviews'),
    path('favorites/', views.FavoriteListCreateView.as_view(), name='favorites'),
    path('favorites/<int:property_id>/', views.FavoriteDeleteView.as_view(), name='favorite-delete'),
]
