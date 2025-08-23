import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from .database import engine, Base
from .routers import auth, banners, products


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
                password_hash=get_password_hash(admin_password)
            )
            db.add(admin_user)
        
        # Create default banners if not exist
        banner_keys = ["hero", "small1", "small2", "small3", "small4"]
        for i, key in enumerate(banner_keys):
            existing_banner = db.query(Banner).filter(Banner.key == key).first()
            if not existing_banner:
                banner = Banner(
                    key=key,
                    title=f"نمونه بنر {key}",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    link_url="https://example.com",
                    price=1000000 if key == "hero" else 500000,
                    currency="IRT",
                    active=True,
                    position=i
                )
                db.add(banner)
        
        db.commit()
    finally:
        db.close()
    
    yield


app = FastAPI(
    title="iShop API",
    description="Persian/Farsi e-commerce platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["authentication"])
app.include_router(banners.router, prefix="/api/v1/banners", tags=["banners"])
app.include_router(products.router, prefix="/api/v1/products", tags=["products"])

# Health check endpoint
@app.get("/api/v1/health")
async def health_check():
    return {"ok": True}

# Serve static files (for uploaded images)
if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
