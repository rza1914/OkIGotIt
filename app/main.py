import os
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from app.routers import auth, admin
from app.database import engine
from app.models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

@app.get("/api/v1/health")
def health():
    return {"ok": True}

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

# Custom SPA handler for client-side routing  
@app.exception_handler(404)
async def spa_handler(request: Request, exc):
    from fastapi import HTTPException
    # If path starts with /api, return proper JSON 404
    if request.url.path.startswith("/api"):
        raise HTTPException(status_code=404, detail="Not Found")
    
    # For all other paths, serve index.html for SPA routing
    if os.path.exists("dist/index.html"):
        return FileResponse("dist/index.html")
    
    raise HTTPException(status_code=404, detail="Not Found")

# Serve SPA at root - MUST BE LAST after all API routes
if os.path.isdir("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="spa")