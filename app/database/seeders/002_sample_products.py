"""
Sample products seeder for iShop
Creates sample Persian product data for testing and demonstration
"""

from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import Product, Category, Banner
from decimal import Decimal


def seed_sample_categories():
    """Create sample product categories"""
    categories_data = [
        {
            "name": "لوازم الکترونیک",
            "name_en": "Electronics",
            "description": "محصولات الکترونیکی و دیجیتال",
            "slug": "electronics"
        },
        {
            "name": "پوشاک",
            "name_en": "Clothing", 
            "description": "انواع پوشاک مردانه و زنانه",
            "slug": "clothing"
        },
        {
            "name": "کتاب و لوازم التحریر",
            "name_en": "Books & Stationery",
            "description": "کتاب، مجله و لوازم التحریر",
            "slug": "books-stationery"
        },
        {
            "name": "خانه و آشپزخانه",
            "name_en": "Home & Kitchen",
            "description": "لوازم خانگی و آشپزخانه",
            "slug": "home-kitchen"
        },
        {
            "name": "زیبایی و بهداشت",
            "name_en": "Beauty & Health",
            "description": "محصولات زیبایی و بهداشتی",
            "slug": "beauty-health"
        }
    ]
    
    db: Session = SessionLocal()
    created_categories = []
    
    try:
        for category_data in categories_data:
            # Check if category already exists
            existing = db.query(Category).filter(Category.slug == category_data["slug"]).first()
            if existing:
                created_categories.append(existing)
                continue
                
            category = Category(**category_data)
            db.add(category)
            created_categories.append(category)
        
        db.commit()
        print(f"✅ Created {len(created_categories)} categories")
        
        return created_categories
        
    except Exception as e:
        print(f"❌ Error creating categories: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def seed_sample_products():
    """Create sample products"""
    
    # First ensure categories exist
    categories = seed_sample_categories()
    category_map = {cat.slug: cat.id for cat in categories}
    
    products_data = [
        {
            "name": "گوشی هوشمند سامسونگ گلکسی A54",
            "name_en": "Samsung Galaxy A54 Smartphone",
            "description": "گوشی هوشمند با صفحه نمایش 6.4 اینچی و دوربین 50 مگاپیکسلی",
            "price": Decimal("15999000"),
            "category_id": category_map.get("electronics"),
            "sku": "SAM-A54-256",
            "stock_quantity": 25,
            "is_active": True,
            "images": ["galaxy-a54-1.jpg", "galaxy-a54-2.jpg"]
        },
        {
            "name": "لپ تاپ ایسوس VivoBook 15",
            "name_en": "ASUS VivoBook 15 Laptop", 
            "description": "لپ تاپ 15.6 اینچی با پردازنده Intel Core i5 و 8GB رم",
            "price": Decimal("28999000"),
            "category_id": category_map.get("electronics"),
            "sku": "ASUS-VB15-I5",
            "stock_quantity": 12,
            "is_active": True,
            "images": ["asus-vivobook-1.jpg"]
        },
        {
            "name": "پیراهن مردانه کلاسیک",
            "name_en": "Men's Classic Shirt",
            "description": "پیراهن مردانه با پارچه نخی مرغوب، مناسب برای محیط کار",
            "price": Decimal("450000"),
            "category_id": category_map.get("clothing"),
            "sku": "MEN-SHIRT-001",
            "stock_quantity": 50,
            "is_active": True,
            "sizes": ["S", "M", "L", "XL", "XXL"],
            "colors": ["سفید", "آبی", "طوسی"]
        },
        {
            "name": "کتاب آموزش برنامه نویسی پایتون",
            "name_en": "Python Programming Learning Book",
            "description": "کتاب جامع آموزش برنامه نویسی پایتون از مقدماتی تا پیشرفته",
            "price": Decimal("280000"),
            "category_id": category_map.get("books-stationery"),
            "sku": "BOOK-PYTHON-001",
            "stock_quantity": 30,
            "is_active": True,
            "author": "محمد رضایی",
            "publisher": "انتشارات فناوری"
        },
        {
            "name": "سرویس قابلمه 12 پارچه استیل",
            "name_en": "12-Piece Steel Cookware Set",
            "description": "سرویس قابلمه استیل ضدزنگ با پوشش نان استیک",
            "price": Decimal("1250000"),
            "category_id": category_map.get("home-kitchen"),
            "sku": "COOK-SET-12P",
            "stock_quantity": 15,
            "is_active": True,
            "brand": "پارس استیل"
        }
    ]
    
    db: Session = SessionLocal()
    
    try:
        created_count = 0
        for product_data in products_data:
            # Check if product already exists
            existing = db.query(Product).filter(Product.sku == product_data["sku"]).first()
            if existing:
                continue
                
            product = Product(**product_data)
            db.add(product)
            created_count += 1
        
        db.commit()
        print(f"✅ Created {created_count} sample products")
        
    except Exception as e:
        print(f"❌ Error creating products: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def seed_sample_banners():
    """Create sample banners"""
    banners_data = [
        {
            "title": "فروش ویژه محصولات الکترونیک",
            "title_en": "Special Electronics Sale",
            "description": "تا 50% تخفیف روی تمام محصولات الکترونیکی",
            "image_url": "banner-electronics-sale.jpg",
            "link_url": "/category/electronics",
            "is_active": True,
            "order_priority": 1
        },
        {
            "title": "کالکشن جدید پوشاک بهاری",
            "title_en": "New Spring Clothing Collection",
            "description": "آخرین مدل‌های لباس برای فصل بهار",
            "image_url": "banner-spring-clothing.jpg", 
            "link_url": "/category/clothing",
            "is_active": True,
            "order_priority": 2
        },
        {
            "title": "ارسال رایگان برای خریدهای بالای 500 هزار تومان",
            "title_en": "Free Shipping Over 500k Toman",
            "description": "بدون هزینه ارسال برای سفارشات بالای 500 هزار تومان",
            "image_url": "banner-free-shipping.jpg",
            "link_url": "/shipping-info",
            "is_active": True,
            "order_priority": 3
        }
    ]
    
    db: Session = SessionLocal()
    
    try:
        created_count = 0
        for banner_data in banners_data:
            # Check if banner already exists
            existing = db.query(Banner).filter(Banner.title == banner_data["title"]).first()
            if existing:
                continue
                
            banner = Banner(**banner_data)
            db.add(banner)
            created_count += 1
        
        db.commit()
        print(f"✅ Created {created_count} sample banners")
        
    except Exception as e:
        print(f"❌ Error creating banners: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def run_all_seeders():
    """Run all product-related seeders"""
    print("🌱 Running sample data seeders...")
    
    seed_sample_categories()
    seed_sample_products()
    seed_sample_banners()
    
    print("✅ All sample data seeders completed!")


if __name__ == "__main__":
    run_all_seeders()