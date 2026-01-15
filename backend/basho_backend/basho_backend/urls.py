from django.contrib import admin
from django.urls import path , include
from django.conf import settings
from django.conf.urls.static import static
 
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/corporate/", include("apps.corporate.urls")),
    path("api/experiences/", include("apps.experiences.urls")),
    path("api/products/", include("apps.products.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/reviews/", include("apps.reviews.urls")),

]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)
 
