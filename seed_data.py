#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
iShop Sample Data Seeder
Adds sample products and banners to the database
"""

import sqlite3
from datetime import datetime

def seed_database():
    conn = sqlite3.connect('ishop.db')
    cursor = conn.cursor()

    # Clear existing data
    cursor.execute('DELETE FROM products')
    cursor.execute('DELETE FROM banners')
    
    # اضافه کردن محصولات نمونه
    products = [
        ("گوشی هوشمند سامسونگ", "گوشی هوشمند با کیفیت بالا و طراحی مدرن", "electronics", 15000000, "IRR", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", "samsung-phone", 10, 1),
        ("لپ‌تاپ ایسوس", "لپ‌تاپ گیمینگ قدرتمند برای کار و بازی", "electronics", 45000000, "IRR", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", "asus-laptop", 5, 1),
        ("کتاب برنامه‌نویسی پایتون", "آموزش کامل پایتون برای مبتدیان تا پیشرفته", "books", 250000, "IRR", "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", "python-book", 20, 1),
        ("ساعت هوشمند اپل", "ساعت هوشمند با امکانات پیشرفته سلامتی", "wearables", 12000000, "IRR", "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400", "apple-watch", 15, 1),
        ("هدفون بلوتوثی", "هدفون باکیفیت با نویز کنسلینگ", "audio", 2500000, "IRR", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", "bluetooth-headphones", 8, 1),
        ("کیف دستی چرمی", "کیف دستی لوکس از چرم طبیعی", "fashion", 3500000, "IRR", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", "leather-bag", 12, 1),
    ]

    for product in products:
        cursor.execute("""
            INSERT INTO products (name, description, category, price, currency, image_url, slug, stock, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (*product, datetime.now(), datetime.now()))
    
    print(f"Added {len(products)} products successfully")

    # اضافه کردن بنرهای نمونه
    banners = [
        ("hero", "فروشگاه آی‌شاپ - خرید آنلاین", "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200", "/products", 0, "IRR", 1, 1),
        ("promo1", "تخفیف ۵۰% محصولات الکترونیکی", "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400", "/products?category=electronics", 0, "IRR", 1, 2),
        ("promo2", "کتاب‌های جدید با تخفیف ویژه", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", "/products?category=books", 0, "IRR", 1, 3),
        ("promo3", "مجموعه کامل لوازم جانبی", "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400", "/products?category=accessories", 0, "IRR", 1, 4),
        ("footer", "خدمات پس از فروش رایگان", "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400", "/support", 0, "IRR", 1, 5)
    ]

    for banner in banners:
        cursor.execute("""
            INSERT INTO banners (key, title, image_url, link_url, price, currency, active, position, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (*banner, datetime.now()))
    
    print(f"Added {len(banners)} banners successfully")

    conn.commit()
    conn.close()
    print("Sample data added successfully!")

if __name__ == "__main__":
    seed_database()