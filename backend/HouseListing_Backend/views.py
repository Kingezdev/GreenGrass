from django.shortcuts import render
from django.views import View

class LandingView(View):
    def get(self, request, *args, **kwargs):
        return render(request, 'HouseListing_Backend/landing.html')
