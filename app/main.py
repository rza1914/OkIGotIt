import os
from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from app.routers import auth, admin, orders, products, cart, product_import, bot_management, telegram_webhook
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="iShop API",
    description="iShop E-commerce Platform API",
    version="1.0.0"
)

# CORS middleware first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint for production
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "iShop API is running",
        "docs_url": "/docs",
        "api_prefix": "/api/v1",
        "version": "1.0.0",
        "environment": os.getenv("ENVIRONMENT", "development")
    }

# Health check endpoint (specific route first)
@app.get("/api/v1/health")
def health():
    return {
        "status": "healthy",
        "service": "iShop API",
        "timestamp": datetime.now().isoformat()
    }

# Include routers (ordered from most specific to most general)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(product_import.router, tags=["product-import"])
app.include_router(bot_management.router, tags=["bot-management"])
app.include_router(telegram_webhook.router, tags=["telegram-webhook"])
app.include_router(cart.router, tags=["cart"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])

@app.get("/api/v1/banners")
def get_banners():
    # Simple static banners for now
    return [
        {
            "key": "hero",
            "title": "بنر اصلی iShop", 
            "image_url": "/hero-banner-iShop.png",
            "link_url": "/products",
            "price": 0,
            "currency": "IRT", 
            "active": True,
            "position": 0,
            "id": 1
        },
        {
            "key": "small1",
            "title": "پیشنهاد ویژه ۱",
            "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
            "link_url": "/products",
            "price": 500000,
            "currency": "IRT",
            "active": True, 
            "position": 1,
            "id": 2
        },
        {
            "key": "small2", 
            "title": "پیشنهاد ویژه ۲",
            "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
            "link_url": "/products",
            "price": 500000,
            "currency": "IRT",
            "active": True,
            "position": 2,
            "id": 3
        },
        {
            "key": "small3",
            "title": "پیشنهاد ویژه ۳", 
            "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
            "link_url": "/products",
            "price": 500000,
            "currency": "IRT",
            "active": True,
            "position": 3,
            "id": 4
        },
        {
            "key": "small4",
            "title": "پیشنهاد ویژه ۴",
            "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", 
            "link_url": "/products",
            "price": 500000,
            "currency": "IRT",
            "active": True,
            "position": 4,
            "id": 5
        }
    ]

@app.get("/api/v1/products")
def get_products():
    # Simple static products for now
    return [
        {
            "id": 1,
            "name": "کیف دستی رزگلد",
            "description": "کیف زنانه لوکس با رنگ طلایی زیبا",
            "category": "کیف",
            "price": 1250000,
            "currency": "IRT", 
            "stock": 10,
            "is_active": True,
            "image_url": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
        },
        {
            "id": 2,
            "name": "کفش مجلسی طلایی", 
            "description": "کفش زنانه مجلسی با رنگ طلایی",
            "category": "کفش",
            "price": 2390000,
            "currency": "IRT",
            "stock": 5,
            "is_active": True,
            "image_url": "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"
        }
    ]

# Custom SPA handler for client-side routing (only in development)
@app.exception_handler(404)
async def spa_handler(request: Request, exc):
    from fastapi import HTTPException

    # In production, return clean JSON 404 (Frontend is hosted separately on Vercel)
    if os.getenv("ENVIRONMENT") == "production":
        return JSONResponse(
            status_code=404,
            content={
                "detail": "Endpoint not found",
                "message": "API is running. Check /docs for available endpoints.",
                "path": request.url.path
            }
        )

    # If path starts with /api, return proper JSON 404
    if request.url.path.startswith("/api"):
        raise HTTPException(status_code=404, detail="Not Found")

    # For all other paths in development, try to serve index.html for SPA routing
    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")

    # Fallback to JSON 404
    return JSONResponse(
        status_code=404,
        content={
            "detail": "Not Found",
            "message": "Frontend dist folder not found. Run 'npm run build' to create it."
        }
    )

# Serve SPA at root - MUST BE LAST after all API routes (only in development)
if os.path.isdir("dist") and os.getenv("ENVIRONMENT") != "production":
    app.mount("/", StaticFiles(directory="dist", html=True), name="spa")