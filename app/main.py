import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Import our existing routers
from app.routers import auth, banners, products, orders
from app.database import engine, get_db
from app.models import Base, User as UserModel, Banner as BannerModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables and default data on startup
    Base.metadata.create_all(bind=engine)
    
    # Create default admin user and banners if they don't exist  
    db: Session = next(get_db())
    try:
        if not db.query(UserModel).filter(UserModel.username == "admin").first():
            from passlib.context import CryptContext
            pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
            admin_user = UserModel(
                username="admin",
                hashed_password=pwd_context.hash("admin123")
            )
            db.add(admin_user)
        
        if db.query(BannerModel).count() == 0:
            from app.schemas import Banner
            default_banners = [
                BannerModel(
                    key="hero", title="بنر اصلی iShop",
                    image_url="/hero-banner-iShop.png",
                    link_url="#", price=0, currency="IRT", active=True, position=0
                ),
                BannerModel(
                    key="small1", title="پیشنهاد ویژه 1",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                    link_url="#", price=500000, currency="IRT", active=True, position=1
                ),
                BannerModel(
                    key="small2", title="پیشنهاد ویژه 2", 
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                    link_url="#", price=500000, currency="IRT", active=True, position=2
                ),
                BannerModel(
                    key="small3", title="پیشنهاد ویژه 3",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", 
                    link_url="#", price=500000, currency="IRT", active=True, position=3
                ),
                BannerModel(
                    key="small4", title="پیشنهاد ویژه 4",
                    image_url="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                    link_url="#", price=500000, currency="IRT", active=True, position=4
                ),
            ]
            for banner in default_banners:
                db.add(banner)
        
        db.commit()
    finally:
        db.close()
    
    yield

app = FastAPI(lifespan=lifespan)

# --- Health endpoint ---
@app.get("/api/v1/health")
def health():
    return {"ok": True}

# Dev CORS باز؛ در پروداکشن محدود کن
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

# Serve static uploads
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# 👇 مهم: کل dist را در ریشه سرو کن تا /app-config.json و بقیه فایل‌ها مستقیم سرو شوند
if os.path.isdir("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="spa")

# ⚠️ نکته مهم: catch-all @app.get("/{path:path}") حذف شد
# چون mount بالا خودش index.html را برای مسیرهای SPA هندل می‌کند
# و اجازه می‌دهد فایل‌های واقعی مثل /app-config.json به‌صورت JSON سرو شوند.