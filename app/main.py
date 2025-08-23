import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from starlette.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .routers import auth, banners, products, orders


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize default data
    from .database import SessionLocal
    from .models import Banner, User
    from .auth import get_password_hash
    
    db = SessionLocal()
    try:
        # Create default admin user if not exists
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")
        
        existing_admin = db.query(User).filter(User.username == admin_username).first()
        if not existing_admin:
            admin_user = User(
                username=admin_username,
                first_name="مدیر",
                last_name="سیستم", 
                email="admin@ishop.com",
                password_hash=get_password_hash(admin_password)
            )
            db.add(admin_user)
        
        # Create default banners if not exist
        existing_hero = db.query(Banner).filter(Banner.key == "hero").first()
        if not existing_hero:
            default_banners = [
                Banner(
                    key="hero",
                    title="بنر اصلی آی‌شاپ - محصولات آرایشی لوکس",
                    image_url="/hero-banner-iShop.png",
                    link_url="/products",
                    price=1000000,
                    currency="IRT",
                    active=True,
                    position=0
                ),
                Banner(
                    key="small1", title="نمونه بنر small1",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    link_url="https://example.com", price=500000, currency="IRT", active=True, position=1
                ),
                Banner(
                    key="small2", title="نمونه بنر small2",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    link_url="https://example.com", price=500000, currency="IRT", active=True, position=2
                ),
                Banner(
                    key="small3", title="نمونه بنر small3",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    link_url="https://example.com", price=500000, currency="IRT", active=True, position=3
                ),
                Banner(
                    key="small4", title="نمونه بنر small4",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    link_url="https://example.com", price=500000, currency="IRT", active=True, position=4
                ),
            ]
            for banner in default_banners:
                db.add(banner)
        
        db.commit()
    finally:
        db.close()
    
    yield


app = FastAPI(lifespan=lifespan)

# Dev: CORS باز (در پروداکشن محدودش کن)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(banners.router, prefix="/api/v1/banners", tags=["banners"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])

@app.get("/api/v1/health")
def health():
    return {"ok": True}

# Serve static uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# سرو فایل‌های باندل‌شده
if os.path.isdir("dist"):
    if os.path.isdir("dist/assets"):
        app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")

# Static files from dist root
@app.get("/app-config.json")
def get_config():
    config_path = os.path.join("dist", "app-config.json")
    if os.path.exists(config_path):
        return FileResponse(config_path, media_type="application/json")
    return {"API_BASE": "/api/v1"}

@app.get("/logo-iShop.png") 
def get_logo():
    logo_path = os.path.join("dist", "logo-iShop.png")
    if os.path.exists(logo_path):
        return FileResponse(logo_path, media_type="image/png")
    return JSONResponse({"detail": "Logo not found"}, status_code=404)

@app.get("/hero-banner-iShop.png")
def get_banner():
    banner_path = os.path.join("dist", "hero-banner-iShop.png")  
    if os.path.exists(banner_path):
        return FileResponse(banner_path, media_type="image/png")
    return JSONResponse({"detail": "Banner not found"}, status_code=404)

@app.get("/vite.svg")
def get_vite_svg():
    vite_path = os.path.join("dist", "vite.svg")
    if os.path.exists(vite_path):
        return FileResponse(vite_path, media_type="image/svg+xml")
    return JSONResponse({"detail": "Vite icon not found"}, status_code=404)

# SPA fallback: هرچی غیر از /api → index.html  
@app.get("/{full_path:path}")
def spa(full_path: str):
    # Don't catch API routes or uploads
    if full_path.startswith("api/") or full_path.startswith("uploads/"):
        return JSONResponse({"detail": "Not found"}, status_code=404)
    
    index_path = os.path.join("dist", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return JSONResponse({"detail": "Frontend not built yet. Run: npm run build"}, status_code=503)