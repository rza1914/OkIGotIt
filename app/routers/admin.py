from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional

router = APIRouter()
security = HTTPBearer()

# Secret key for JWT (in production, use environment variable)
SECRET_KEY = "your-super-secret-admin-key-change-in-production"
ALGORITHM = "HS256"

# Mock admin data (in production, use database)
MOCK_ADMIN = {
    "id": 1,
    "username": "admin@site.com",
    "password": "Admin@123456",  # In production, hash this
    "first_name": "ادمین",
    "last_name": "سیستم", 
    "email": "admin@site.com",
    "role": "super_admin",
    "permissions": [
        "dashboard.view", "users.view", "users.create", "users.edit", "users.delete",
        "content.view", "content.create", "content.edit", "content.delete",
        "analytics.view", "settings.view", "admins.view", "admins.create",
        "admins.edit", "admins.delete"
    ],
    "is_active": True,
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": datetime.utcnow().isoformat() + "Z"
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return username
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

@router.post("/auth/login")
async def admin_login(credentials: dict):
    username = credentials.get("username")
    password = credentials.get("password")
    
    if username != MOCK_ADMIN["username"] or password != MOCK_ADMIN["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token(data={"sub": username})
    admin_data = MOCK_ADMIN.copy()
    admin_data.pop("password")  # Don't return password
    
    return {
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "admin": admin_data
        }
    }

@router.get("/auth/me")
async def get_current_admin(current_user: str = Depends(verify_token)):
    admin_data = MOCK_ADMIN.copy()
    admin_data.pop("password")  # Don't return password
    return {"data": admin_data}

@router.post("/auth/refresh")
async def refresh_token(current_user: str = Depends(verify_token)):
    access_token = create_access_token(data={"sub": current_user})
    admin_data = MOCK_ADMIN.copy()
    admin_data.pop("password")
    
    return {
        "data": {
            "access_token": access_token,
            "token_type": "bearer",
            "admin": admin_data
        }
    }

@router.post("/auth/logout")
async def admin_logout(current_user: str = Depends(verify_token)):
    return {"message": "Successfully logged out"}

@router.get("/dashboard/stats")
async def get_dashboard_stats(current_user: str = Depends(verify_token)):
    return {
        "data": {
            "total_users": 1250,
            "active_users": 890,
            "total_orders": 567,
            "total_revenue": 12500000,
            "admin_email": MOCK_ADMIN["email"]
        }
    }

@router.get("/dashboard/activity")
async def get_recent_activity(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "action": "ایجاد محصول جدید",
                "admin_id": 1,
                "admin_name": "احمد محمدی",
                "timestamp": (datetime.utcnow() - timedelta(minutes=30)).isoformat() + "Z",
                "details": "محصول 'کیف دستی' اضافه شد"
            },
            {
                "id": 2,
                "action": "بروزرسانی کاربر",
                "admin_id": 2,
                "admin_name": "فاطمه کریمی",
                "timestamp": (datetime.utcnow() - timedelta(hours=2)).isoformat() + "Z",
                "details": "کاربر احمد رضایی بروزرسانی شد"
            },
            {
                "id": 3,
                "action": "حذف سفارش",
                "admin_id": 1,
                "admin_name": "احمد محمدی",
                "timestamp": (datetime.utcnow() - timedelta(hours=5)).isoformat() + "Z",
                "details": "سفارش #1234 حذف شد"
            }
        ]
    }

@router.get("/notifications")
async def get_notifications(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "title": "سفارش جدید",
                "message": "سفارش جدید از کاربر احمد رضایی دریافت شد",
                "type": "info",
                "read": False,
                "timestamp": (datetime.utcnow() - timedelta(minutes=15)).isoformat() + "Z"
            },
            {
                "id": 2,
                "title": "خطای سرور",
                "message": "خطای 500 در API محصولات رخ داده",
                "type": "error", 
                "read": True,
                "timestamp": (datetime.utcnow() - timedelta(hours=1)).isoformat() + "Z"
            }
        ]
    }

@router.get("/users")
async def get_users(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "username": "ahmad.rezaee",
                "email": "ahmad@example.com",
                "first_name": "احمد",
                "last_name": "رضایی",
                "is_active": True,
                "created_at": "2024-01-15T10:30:00Z"
            },
            {
                "id": 2,
                "username": "fateme.karimi", 
                "email": "fateme@example.com",
                "first_name": "فاطمه",
                "last_name": "کریمی",
                "is_active": True,
                "created_at": "2024-01-20T14:20:00Z"
            }
        ]
    }

# Banner Management APIs
@router.get("/banners")
async def get_admin_banners(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "title": "بنر اصلی iShop",
                "image_url": "/hero-banner-iShop.png",
                "link_url": "/products",
                "position": 0,
                "is_active": True,
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-01-15T12:30:00Z"
            },
            {
                "id": 2,
                "title": "پیشنهاد ویژه ۱",
                "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                "link_url": "/products",
                "position": 1,
                "is_active": True,
                "created_at": "2024-01-10T10:00:00Z",
                "updated_at": "2024-01-20T15:45:00Z"
            },
            {
                "id": 3,
                "title": "پیشنهاد ویژه ۲",
                "image_url": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
                "link_url": "/products",
                "position": 2,
                "is_active": True,
                "created_at": "2024-01-12T14:20:00Z",
                "updated_at": "2024-01-18T09:10:00Z"
            }
        ]
    }

@router.post("/banners")
async def create_banner(banner_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": 4,
            "title": banner_data.get("title", "بنر جدید"),
            "image_url": banner_data.get("image_url", ""),
            "link_url": banner_data.get("link_url", "/"),
            "position": banner_data.get("position", 0),
            "is_active": banner_data.get("is_active", True),
            "created_at": datetime.utcnow().isoformat() + "Z",
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "بنر با موفقیت ایجاد شد"
    }

@router.put("/banners/{banner_id}")
async def update_banner(banner_id: int, banner_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": banner_id,
            "title": banner_data.get("title", "بنر بروزرسانی شده"),
            "image_url": banner_data.get("image_url", ""),
            "link_url": banner_data.get("link_url", "/"),
            "position": banner_data.get("position", 0),
            "is_active": banner_data.get("is_active", True),
            "created_at": "2024-01-01T00:00:00Z",
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "بنر با موفقیت بروزرسانی شد"
    }

@router.delete("/banners/{banner_id}")
async def delete_banner(banner_id: int, current_user: str = Depends(verify_token)):
    return {
        "message": "بنر با موفقیت حذف شد",
        "deleted_id": banner_id
    }

@router.post("/banners/{banner_id}/toggle")
async def toggle_banner_status(banner_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": banner_id,
            "is_active": True,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "وضعیت بنر تغییر یافت"
    }

# Blog Management APIs
@router.get("/blog/posts")
async def get_blog_posts(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "title": "معرفی جدیدترین محصولات iShop",
                "content": "در این مقاله به معرفی جدیدترین محصولات فروشگاه iShop می‌پردازیم...",
                "summary": "محصولات جدید و متنوع iShop",
                "slug": "newest-ishop-products",
                "status": "published",
                "featured_image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
                "author": "احمد محمدی",
                "author_id": 1,
                "views": 1250,
                "tags": ["محصولات", "iShop", "جدید"],
                "created_at": "2024-01-15T09:30:00Z",
                "updated_at": "2024-01-20T14:45:00Z",
                "published_at": "2024-01-15T10:00:00Z"
            },
            {
                "id": 2,
                "title": "راهنمای خرید آنلاین از iShop",
                "content": "نحوه خرید آنلاین از فروشگاه iShop را در این مقاله آموزش می‌دهیم...",
                "summary": "آموزش کامل خرید آنلاین",
                "slug": "online-shopping-guide",
                "status": "published",
                "featured_image": "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600",
                "author": "فاطمه کریمی",
                "author_id": 2,
                "views": 890,
                "tags": ["آموزش", "خرید", "راهنما"],
                "created_at": "2024-01-18T11:20:00Z",
                "updated_at": "2024-01-22T16:30:00Z",
                "published_at": "2024-01-18T12:00:00Z"
            },
            {
                "id": 3,
                "title": "تکنولوژی جدید در فروشگاه‌های آنلاین",
                "content": "بررسی تکنولوژی‌های نوین مورد استفاده در فروشگاه‌های اینترنتی...",
                "summary": "تکنولوژی و نوآوری در e-commerce",
                "slug": "new-ecommerce-technology",
                "status": "draft",
                "featured_image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600",
                "author": "علی رضایی",
                "author_id": 3,
                "views": 0,
                "tags": ["تکنولوژی", "نوآوری", "فروشگاه"],
                "created_at": "2024-01-22T08:15:00Z",
                "updated_at": "2024-01-22T10:20:00Z",
                "published_at": None
            }
        ]
    }

@router.post("/blog/posts")
async def create_blog_post(post_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": 4,
            "title": post_data.get("title", "مقاله جدید"),
            "content": post_data.get("content", ""),
            "summary": post_data.get("summary", ""),
            "slug": post_data.get("slug", "new-post"),
            "status": post_data.get("status", "draft"),
            "featured_image": post_data.get("featured_image", ""),
            "author": "ادمین سیستم",
            "author_id": 1,
            "views": 0,
            "tags": post_data.get("tags", []),
            "created_at": datetime.utcnow().isoformat() + "Z",
            "updated_at": datetime.utcnow().isoformat() + "Z",
            "published_at": None
        },
        "message": "مقاله با موفقیت ایجاد شد"
    }

@router.put("/blog/posts/{post_id}")
async def update_blog_post(post_id: int, post_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": post_id,
            "title": post_data.get("title", "مقاله بروزرسانی شده"),
            "content": post_data.get("content", ""),
            "summary": post_data.get("summary", ""),
            "slug": post_data.get("slug", "updated-post"),
            "status": post_data.get("status", "draft"),
            "featured_image": post_data.get("featured_image", ""),
            "author": "ادمین سیستم",
            "author_id": 1,
            "views": 150,
            "tags": post_data.get("tags", []),
            "created_at": "2024-01-15T09:30:00Z",
            "updated_at": datetime.utcnow().isoformat() + "Z",
            "published_at": "2024-01-15T10:00:00Z"
        },
        "message": "مقاله با موفقیت بروزرسانی شد"
    }

@router.delete("/blog/posts/{post_id}")
async def delete_blog_post(post_id: int, current_user: str = Depends(verify_token)):
    return {
        "message": "مقاله با موفقیت حذف شد",
        "deleted_id": post_id
    }

@router.post("/blog/posts/{post_id}/publish")
async def publish_blog_post(post_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": post_id,
            "status": "published",
            "published_at": datetime.utcnow().isoformat() + "Z",
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "مقاله منتشر شد"
    }

@router.post("/blog/posts/{post_id}/unpublish")
async def unpublish_blog_post(post_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": post_id,
            "status": "draft",
            "published_at": None,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "انتشار مقاله لغو شد"
    }

@router.get("/blog/categories")
async def get_blog_categories(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {"id": 1, "name": "محصولات", "slug": "products", "posts_count": 15},
            {"id": 2, "name": "آموزش", "slug": "tutorials", "posts_count": 8},
            {"id": 3, "name": "تکنولوژی", "slug": "technology", "posts_count": 5},
            {"id": 4, "name": "اخبار", "slug": "news", "posts_count": 12}
        ]
    }

# Order Management APIs
@router.get("/orders")
async def get_orders(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1001,
                "order_number": "ORD-2024-001",
                "customer": {
                    "id": 15,
                    "name": "علی احمدی",
                    "email": "ali.ahmadi@example.com",
                    "phone": "09121234567"
                },
                "items": [
                    {
                        "id": 1,
                        "product_id": 5,
                        "name": "کیف دستی رزگلد",
                        "price": 1250000,
                        "quantity": 1,
                        "total": 1250000
                    },
                    {
                        "id": 2,
                        "product_id": 8,
                        "name": "کفش مجلسی طلایی",
                        "price": 2390000,
                        "quantity": 1,
                        "total": 2390000
                    }
                ],
                "total_amount": 3640000,
                "shipping_cost": 50000,
                "tax_amount": 364000,
                "final_amount": 4054000,
                "status": "pending",
                "payment_status": "unpaid",
                "payment_method": "cod",
                "shipping_address": {
                    "street": "خیابان ولیعصر، پلاک 123",
                    "city": "تهران",
                    "state": "تهران",
                    "postal_code": "1234567890"
                },
                "tracking_code": null,
                "notes": "لطفا سریع ارسال شود",
                "created_at": "2024-01-20T10:30:00Z",
                "updated_at": "2024-01-20T10:30:00Z",
                "estimated_delivery": "2024-01-25T00:00:00Z"
            },
            {
                "id": 1002,
                "order_number": "ORD-2024-002",
                "customer": {
                    "id": 28,
                    "name": "فاطمه محمدی",
                    "email": "fateme.mohammadi@example.com",
                    "phone": "09129876543"
                },
                "items": [
                    {
                        "id": 3,
                        "product_id": 3,
                        "name": "ساعت هوشمند",
                        "price": 1495000,
                        "quantity": 1,
                        "total": 1495000
                    }
                ],
                "total_amount": 1495000,
                "shipping_cost": 30000,
                "tax_amount": 149500,
                "final_amount": 1674500,
                "status": "processing",
                "payment_status": "paid",
                "payment_method": "online",
                "shipping_address": {
                    "street": "خیابان آزادی، کوچه 15، پلاک 8",
                    "city": "مشهد",
                    "state": "خراسان رضوی",
                    "postal_code": "9876543210"
                },
                "tracking_code": "TRK-789456123",
                "notes": null,
                "created_at": "2024-01-19T14:15:00Z",
                "updated_at": "2024-01-20T09:45:00Z",
                "estimated_delivery": "2024-01-24T00:00:00Z"
            },
            {
                "id": 1003,
                "order_number": "ORD-2024-003",
                "customer": {
                    "id": 42,
                    "name": "محمد رضایی",
                    "email": "mohammad.rezaei@example.com",
                    "phone": "09135551234"
                },
                "items": [
                    {
                        "id": 4,
                        "product_id": 12,
                        "name": "هدفون بلوتوثی",
                        "price": 899000,
                        "quantity": 2,
                        "total": 1798000
                    }
                ],
                "total_amount": 1798000,
                "shipping_cost": 40000,
                "tax_amount": 179800,
                "final_amount": 2017800,
                "status": "completed",
                "payment_status": "paid",
                "payment_method": "card",
                "shipping_address": {
                    "street": "بلوار کشاورز، خیابان 18، پلاک 25",
                    "city": "اصفهان",
                    "state": "اصفهان",
                    "postal_code": "1357924680"
                },
                "tracking_code": "TRK-456789321",
                "notes": "تحویل داده شد",
                "created_at": "2024-01-18T11:20:00Z",
                "updated_at": "2024-01-22T16:30:00Z",
                "estimated_delivery": "2024-01-23T00:00:00Z"
            }
        ]
    }

@router.get("/orders/{order_id}")
async def get_order_detail(order_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": order_id,
            "order_number": f"ORD-2024-{order_id:03d}",
            "customer": {
                "id": 15,
                "name": "علی احمدی",
                "email": "ali.ahmadi@example.com",
                "phone": "09121234567"
            },
            "items": [
                {
                    "id": 1,
                    "product_id": 5,
                    "name": "کیف دستی رزگلد",
                    "price": 1250000,
                    "quantity": 1,
                    "total": 1250000,
                    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100"
                }
            ],
            "total_amount": 1250000,
            "shipping_cost": 50000,
            "tax_amount": 125000,
            "final_amount": 1425000,
            "status": "pending",
            "payment_status": "unpaid",
            "payment_method": "cod",
            "shipping_address": {
                "street": "خیابان ولیعصر، پلاک 123",
                "city": "تهران",
                "state": "تهران",
                "postal_code": "1234567890"
            },
            "tracking_code": null,
            "notes": "لطفا سریع ارسال شود",
            "created_at": "2024-01-20T10:30:00Z",
            "updated_at": "2024-01-20T10:30:00Z",
            "estimated_delivery": "2024-01-25T00:00:00Z"
        }
    }

@router.put("/orders/{order_id}/status")
async def update_order_status(order_id: int, status_data: dict, current_user: str = Depends(verify_token)):
    new_status = status_data.get("status", "pending")
    tracking_code = status_data.get("tracking_code")
    
    return {
        "data": {
            "id": order_id,
            "status": new_status,
            "tracking_code": tracking_code,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": f"وضعیت سفارش به '{new_status}' تغییر یافت"
    }

@router.put("/orders/{order_id}/payment")
async def update_payment_status(order_id: int, payment_data: dict, current_user: str = Depends(verify_token)):
    payment_status = payment_data.get("payment_status", "unpaid")
    
    return {
        "data": {
            "id": order_id,
            "payment_status": payment_status,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": f"وضعیت پرداخت به '{payment_status}' تغییر یافت"
    }

@router.delete("/orders/{order_id}")
async def delete_order(order_id: int, current_user: str = Depends(verify_token)):
    return {
        "message": "سفارش با موفقیت حذف شد",
        "deleted_id": order_id
    }

@router.get("/orders/stats")
async def get_order_stats(current_user: str = Depends(verify_token)):
    return {
        "data": {
            "total_orders": 567,
            "pending_orders": 45,
            "processing_orders": 23,
            "completed_orders": 489,
            "cancelled_orders": 10,
            "total_revenue": 12500000,
            "monthly_revenue": 2300000,
            "average_order_value": 2205556
        }
    }

# Product Management APIs
@router.get("/products")
async def get_admin_products(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "name": "کیف دستی رزگلد",
                "description": "کیف زنانه لوکس با رنگ طلایی زیبا و طراحی منحصربفرد",
                "category": "کیف و کوله",
                "price": 1250000,
                "cost_price": 800000,
                "currency": "IRT",
                "stock": 10,
                "min_stock": 5,
                "max_stock": 50,
                "sku": "BAG-GOLD-001",
                "barcode": "123456789001",
                "weight": 0.5,
                "dimensions": "30x20x10",
                "is_active": True,
                "is_featured": True,
                "tags": ["کیف", "زنانه", "طلایی", "لوکس"],
                "images": [
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
                    "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"
                ],
                "seo_title": "کیف دستی رزگلد - فروشگاه iShop",
                "seo_description": "خرید کیف دستی رزگلد با کیفیت عالی از فروشگاه iShop",
                "created_at": "2024-01-15T10:30:00Z",
                "updated_at": "2024-01-20T14:45:00Z"
            },
            {
                "id": 2,
                "name": "کفش مجلسی طلایی",
                "description": "کفش زنانه مجلسی با رنگ طلایی و پاشنه بلند",
                "category": "کفش",
                "price": 2390000,
                "cost_price": 1500000,
                "currency": "IRT",
                "stock": 5,
                "min_stock": 3,
                "max_stock": 25,
                "sku": "SHOE-GOLD-002",
                "barcode": "123456789002",
                "weight": 0.8,
                "dimensions": "25x10x12",
                "is_active": True,
                "is_featured": False,
                "tags": ["کفش", "زنانه", "مجلسی", "طلایی"],
                "images": [
                    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"
                ],
                "seo_title": "کفش مجلسی طلایی - فروشگاه iShop",
                "seo_description": "خرید کفش مجلسی طلایی با قیمت مناسب از فروشگاه iShop",
                "created_at": "2024-01-18T12:20:00Z",
                "updated_at": "2024-01-22T09:15:00Z"
            },
            {
                "id": 3,
                "name": "ساعت هوشمند",
                "description": "ساعت هوشمند با امکانات پیشرفته و باتری طولانی مدت",
                "category": "الکترونیک",
                "price": 1495000,
                "cost_price": 1000000,
                "currency": "IRT",
                "stock": 15,
                "min_stock": 8,
                "max_stock": 30,
                "sku": "WATCH-SMART-003",
                "barcode": "123456789003",
                "weight": 0.2,
                "dimensions": "4x4x1",
                "is_active": True,
                "is_featured": True,
                "tags": ["ساعت", "هوشمند", "الکترونیک"],
                "images": [
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
                ],
                "seo_title": "ساعت هوشمند - فروشگاه iShop",
                "seo_description": "خرید ساعت هوشمند با بهترین کیفیت از فروشگاه iShop",
                "created_at": "2024-01-12T08:45:00Z",
                "updated_at": "2024-01-19T16:30:00Z"
            }
        ]
    }

@router.post("/products")
async def create_product(product_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": 4,
            "name": product_data.get("name", "محصول جدید"),
            "description": product_data.get("description", ""),
            "category": product_data.get("category", "عمومی"),
            "price": product_data.get("price", 0),
            "cost_price": product_data.get("cost_price", 0),
            "currency": "IRT",
            "stock": product_data.get("stock", 0),
            "min_stock": product_data.get("min_stock", 0),
            "max_stock": product_data.get("max_stock", 100),
            "sku": product_data.get("sku", "NEW-PROD-004"),
            "barcode": product_data.get("barcode", ""),
            "weight": product_data.get("weight", 0),
            "dimensions": product_data.get("dimensions", ""),
            "is_active": product_data.get("is_active", True),
            "is_featured": product_data.get("is_featured", False),
            "tags": product_data.get("tags", []),
            "images": product_data.get("images", []),
            "seo_title": product_data.get("seo_title", ""),
            "seo_description": product_data.get("seo_description", ""),
            "created_at": datetime.utcnow().isoformat() + "Z",
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "محصول با موفقیت ایجاد شد"
    }

@router.put("/products/{product_id}")
async def update_product(product_id: int, product_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": product_id,
            "name": product_data.get("name", "محصول بروزرسانی شده"),
            "description": product_data.get("description", ""),
            "category": product_data.get("category", "عمومی"),
            "price": product_data.get("price", 0),
            "cost_price": product_data.get("cost_price", 0),
            "currency": "IRT",
            "stock": product_data.get("stock", 0),
            "min_stock": product_data.get("min_stock", 0),
            "max_stock": product_data.get("max_stock", 100),
            "sku": product_data.get("sku", f"UPD-PROD-{product_id:03d}"),
            "barcode": product_data.get("barcode", ""),
            "weight": product_data.get("weight", 0),
            "dimensions": product_data.get("dimensions", ""),
            "is_active": product_data.get("is_active", True),
            "is_featured": product_data.get("is_featured", False),
            "tags": product_data.get("tags", []),
            "images": product_data.get("images", []),
            "seo_title": product_data.get("seo_title", ""),
            "seo_description": product_data.get("seo_description", ""),
            "created_at": "2024-01-15T10:30:00Z",
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "محصول با موفقیت بروزرسانی شد"
    }

@router.delete("/products/{product_id}")
async def delete_product(product_id: int, current_user: str = Depends(verify_token)):
    return {
        "message": "محصول با موفقیت حذف شد",
        "deleted_id": product_id
    }

@router.post("/products/{product_id}/toggle")
async def toggle_product_status(product_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": product_id,
            "is_active": True,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "وضعیت محصول تغییر یافت"
    }

@router.get("/products/categories")
async def get_product_categories(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {"id": 1, "name": "کیف و کوله", "slug": "bags", "products_count": 25},
            {"id": 2, "name": "کفش", "slug": "shoes", "products_count": 18},
            {"id": 3, "name": "الکترونیک", "slug": "electronics", "products_count": 32},
            {"id": 4, "name": "پوشاک", "slug": "clothing", "products_count": 45},
            {"id": 5, "name": "آرایشی و بهداشتی", "slug": "cosmetics", "products_count": 28}
        ]
    }

@router.get("/products/low-stock")
async def get_low_stock_products(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 2,
                "name": "کفش مجلسی طلایی",
                "stock": 5,
                "min_stock": 10,
                "category": "کفش"
            },
            {
                "id": 15,
                "name": "کیف چرمی مشکی",
                "stock": 3,
                "min_stock": 8,
                "category": "کیف و کوله"
            },
            {
                "id": 28,
                "name": "هدفون بی‌سیم",
                "stock": 2,
                "min_stock": 5,
                "category": "الکترونیک"
            }
        ]
    }

# User Management APIs (Enhanced)
@router.get("/users/detailed")
async def get_detailed_users(current_user: str = Depends(verify_token)):
    return {
        "data": [
            {
                "id": 1,
                "username": "ahmad.rezaei",
                "email": "ahmad@example.com",
                "first_name": "احمد",
                "last_name": "رضایی",
                "phone": "09121234567",
                "is_active": True,
                "role": "user",
                "email_verified": True,
                "phone_verified": False,
                "total_orders": 15,
                "total_spent": 18750000,
                "last_login": "2024-01-22T10:30:00Z",
                "last_order": "2024-01-20T14:45:00Z",
                "created_at": "2024-01-15T10:30:00Z",
                "address": {
                    "street": "خیابان ولیعصر، پلاک 123",
                    "city": "تهران",
                    "state": "تهران",
                    "postal_code": "1234567890"
                }
            },
            {
                "id": 2,
                "username": "fateme.karimi",
                "email": "fateme@example.com",
                "first_name": "فاطمه",
                "last_name": "کریمی",
                "phone": "09129876543",
                "is_active": True,
                "role": "user",
                "email_verified": True,
                "phone_verified": True,
                "total_orders": 8,
                "total_spent": 9850000,
                "last_login": "2024-01-22T08:15:00Z",
                "last_order": "2024-01-19T16:20:00Z",
                "created_at": "2024-01-20T14:20:00Z",
                "address": {
                    "street": "خیابان آزادی، کوچه 15، پلاک 8",
                    "city": "مشهد",
                    "state": "خراسان رضوی",
                    "postal_code": "9876543210"
                }
            }
        ]
    }

@router.put("/users/{user_id}")
async def update_user(user_id: int, user_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": user_id,
            "username": user_data.get("username", "updated.user"),
            "email": user_data.get("email", "user@example.com"),
            "first_name": user_data.get("first_name", "کاربر"),
            "last_name": user_data.get("last_name", "بروزرسانی شده"),
            "phone": user_data.get("phone", ""),
            "is_active": user_data.get("is_active", True),
            "role": user_data.get("role", "user"),
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "کاربر با موفقیت بروزرسانی شد"
    }

@router.delete("/users/{user_id}")
async def delete_user(user_id: int, current_user: str = Depends(verify_token)):
    return {
        "message": "کاربر با موفقیت حذف شد",
        "deleted_id": user_id
    }

@router.post("/users/{user_id}/activate")
async def activate_user(user_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": user_id,
            "is_active": True,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "کاربر فعال شد"
    }

@router.post("/users/{user_id}/deactivate")
async def deactivate_user(user_id: int, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "id": user_id,
            "is_active": False,
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "کاربر غیرفعال شد"
    }

@router.get("/users/stats")
async def get_user_stats(current_user: str = Depends(verify_token)):
    return {
        "data": {
            "total_users": 1250,
            "active_users": 890,
            "inactive_users": 360,
            "verified_users": 920,
            "new_users_this_month": 45,
            "top_customers": [
                {"id": 15, "name": "علی احمدی", "total_spent": 18750000},
                {"id": 28, "name": "فاطمه محمدی", "total_spent": 15200000},
                {"id": 42, "name": "محمد رضایی", "total_spent": 12800000}
            ]
        }
    }

# Settings Management APIs
@router.get("/settings")
async def get_settings(current_user: str = Depends(verify_token)):
    return {
        "data": {
            "site": {
                "name": "فروشگاه iShop",
                "description": "فروشگاه آنلاین محصولات با کیفیت",
                "logo": "/logo.png",
                "favicon": "/favicon.ico",
                "contact_email": "info@ishop.ir",
                "contact_phone": "021-12345678",
                "address": "تهران، خیابان ولیعصر، پلاک 123"
            },
            "ecommerce": {
                "currency": "IRT",
                "tax_rate": 0.1,
                "shipping_cost": 50000,
                "free_shipping_threshold": 1000000,
                "cod_enabled": True,
                "online_payment_enabled": True
            },
            "email": {
                "smtp_host": "smtp.gmail.com",
                "smtp_port": 587,
                "smtp_username": "noreply@ishop.ir",
                "smtp_password": "***",
                "from_email": "noreply@ishop.ir",
                "from_name": "فروشگاه iShop"
            },
            "sms": {
                "provider": "kavenegar",
                "api_key": "***",
                "sender": "10008663",
                "enabled": True
            },
            "social": {
                "instagram": "https://instagram.com/ishop",
                "telegram": "https://t.me/ishop",
                "whatsapp": "09121234567"
            },
            "seo": {
                "meta_title": "فروشگاه iShop - خرید آنلاین",
                "meta_description": "فروشگاه آنلاین iShop با بهترین کیفیت و قیمت",
                "meta_keywords": "فروشگاه، آنلاین، iShop",
                "google_analytics": "GA_MEASUREMENT_ID"
            }
        }
    }

@router.put("/settings")
async def update_settings(settings_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "site": settings_data.get("site", {}),
            "ecommerce": settings_data.get("ecommerce", {}),
            "email": settings_data.get("email", {}),
            "sms": settings_data.get("sms", {}),
            "social": settings_data.get("social", {}),
            "seo": settings_data.get("seo", {}),
            "updated_at": datetime.utcnow().isoformat() + "Z"
        },
        "message": "تنظیمات با موفقیت بروزرسانی شد"
    }

@router.get("/settings/backup")
async def backup_settings(current_user: str = Depends(verify_token)):
    return {
        "data": {
            "backup_url": "/api/v1/admin/settings/download-backup",
            "created_at": datetime.utcnow().isoformat() + "Z",
            "size": "2.5 MB"
        },
        "message": "فایل پشتیبان تهیه شد"
    }

@router.post("/settings/restore")
async def restore_settings(backup_data: dict, current_user: str = Depends(verify_token)):
    return {
        "data": {
            "restored_at": datetime.utcnow().isoformat() + "Z",
            "restored_items": 45
        },
        "message": "تنظیمات از فایل پشتیبان بازیابی شد"
    }