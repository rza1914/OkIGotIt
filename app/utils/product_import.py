import re
import requests
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import datetime
import logging
from urllib.parse import urlparse
import mimetypes

from app.models import Product
from app.schemas import ProductImport, ImportResult

logger = logging.getLogger(__name__)

class ProductImportProcessor:
    def __init__(self, db: Session):
        self.db = db
    
    async def process_product_row(self, row: Dict[str, Any], user_id: int) -> ImportResult:
        """پردازش یک سطر از فایل import"""
        try:
            # Validate required fields
            validation_result = self.validate_product_data(row)
            if not validation_result.success:
                return validation_result
            
            # Extract and clean data
            product_data = self.extract_product_data(row)
            
            # Check if product exists (by SKU or name)
            existing_product = self.find_existing_product(product_data)
            
            if existing_product:
                # Update existing product
                result = await self.update_existing_product(existing_product, product_data, user_id)
            else:
                # Create new product
                result = await self.create_new_product(product_data, user_id)
            
            return result
            
        except Exception as e:
            logger.error(f"Error processing product row: {str(e)}")
            return ImportResult(
                success=False,
                error=f"خطا در پردازش: {str(e)}",
                product_id=None
            )
    
    def validate_product_data(self, row: Dict[str, Any]) -> ImportResult:
        """اعتبارسنجی داده‌های محصول"""
        errors = []
        
        # Required fields
        required_fields = ['name', 'price']
        for field in required_fields:
            if not row.get(field) or str(row[field]).strip() == '':
                errors.append(f"فیلد {field} الزامی است")
        
        # Validate price
        if row.get('price'):
            try:
                price = float(str(row['price']).replace(',', ''))
                if price < 0:
                    errors.append("قیمت نمی‌تواند منفی باشد")
            except (ValueError, TypeError):
                errors.append("فرمت قیمت صحیح نیست")
        
        # Validate stock_quantity
        if row.get('stock_quantity'):
            try:
                stock = int(str(row['stock_quantity']))
                if stock < 0:
                    errors.append("موجودی نمی‌تواند منفی باشد")
            except (ValueError, TypeError):
                errors.append("فرمت موجودی صحیح نیست")
        
        # Validate image URL if provided
        if row.get('image_url') and str(row['image_url']).strip():
            if not self.is_valid_url(str(row['image_url']).strip()):
                errors.append("آدرس تصویر معتبر نیست")
        
        if errors:
            return ImportResult(
                success=False,
                error="; ".join(errors),
                product_id=None
            )
        
        return ImportResult(success=True, error=None, product_id=None)
    
    def extract_product_data(self, row: Dict[str, Any]) -> Dict[str, Any]:
        """استخراج و تمیزکاری داده‌های محصول"""
        data = {}
        
        # Basic fields
        data['name'] = str(row.get('name', '')).strip()
        data['description'] = str(row.get('description', '')).strip()
        data['sku'] = str(row.get('sku', '')).strip()
        
        # Price (convert to integer - smallest currency unit)
        try:
            price_float = float(str(row.get('price', 0)).replace(',', ''))
            data['price'] = int(price_float)  # Convert to integer for database
        except (ValueError, TypeError):
            data['price'] = 0
        
        # Stock quantity (maps to 'stock' field in Product model)
        try:
            data['stock'] = int(str(row.get('stock_quantity', 0)))
        except (ValueError, TypeError):
            data['stock'] = 0
        
        # Boolean fields
        data['is_active'] = self.parse_boolean(row.get('is_active', True))
        
        # Image URL
        image_url = str(row.get('image_url', '')).strip()
        data['image_url'] = image_url if self.is_valid_url(image_url) else None
        
        # Category
        data['category'] = str(row.get('category', '')).strip()
        
        # Currency
        data['currency'] = 'IRT'
        
        # Generate slug from name
        base_slug = self.generate_slug(data['name'])
        data['slug'] = self.ensure_unique_slug(base_slug)
        
        return data
    
    def find_existing_product(self, product_data: Dict[str, Any]) -> Optional[Product]:
        """جستجوی محصول موجود"""
        query = self.db.query(Product)
        
        # Search by name and slug (since Product model doesn't have SKU field)
        product = query.filter(Product.name == product_data['name']).first()
        if product:
            return product
            
        # Search by slug as fallback
        product = query.filter(Product.slug == product_data['slug']).first()
        return product
    
    async def create_new_product(self, product_data: Dict[str, Any], user_id: int) -> ImportResult:
        """ایجاد محصول جدید"""
        try:
            # Download image if URL provided
            image_path = None
            if product_data.get('image_url'):
                image_path = await self.download_product_image(
                    product_data['image_url'],
                    product_data['name']
                )
            
            # Create product using correct field names
            new_product = Product(
                name=product_data['name'],
                description=product_data['description'],
                price=product_data['price'],
                stock=product_data['stock'],  # maps to stock_quantity in CSV
                category=product_data['category'],
                image_url=image_path or product_data.get('image_url'),
                slug=product_data['slug'],
                currency=product_data['currency'],
                is_active=product_data['is_active']
            )
            
            self.db.add(new_product)
            self.db.commit()
            self.db.refresh(new_product)
            
            return ImportResult(
                success=True,
                error=None,
                product_id=new_product.id,
                action="created"
            )
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error creating product: {str(e)}")
            return ImportResult(
                success=False,
                error=f"خطا در ایجاد محصول: {str(e)}",
                product_id=None
            )
    
    async def update_existing_product(self, product: Product, product_data: Dict[str, Any], user_id: int) -> ImportResult:
        """به‌روزرسانی محصول موجود"""
        try:
            # Update fields
            product.name = product_data['name']
            product.description = product_data['description']
            product.price = product_data['price']
            product.stock = product_data['stock']  # maps to stock_quantity in CSV
            product.is_active = product_data['is_active']
            
            if product_data.get('category'):
                product.category = product_data['category']
            
            # Update slug if name changed
            if product_data['slug'] != product.slug:
                # Check if new slug already exists
                existing_slug = self.db.query(Product).filter(
                    Product.slug == product_data['slug'],
                    Product.id != product.id
                ).first()
                
                if not existing_slug:
                    product.slug = product_data['slug']
            
            # Update image if new URL provided
            if product_data.get('image_url') and product_data['image_url'] != product.image_url:
                image_path = await self.download_product_image(
                    product_data['image_url'],
                    product_data['name']
                )
                if image_path:
                    product.image_url = image_path
            
            self.db.commit()
            
            return ImportResult(
                success=True,
                error=None,
                product_id=product.id,
                action="updated"
            )
            
        except Exception as e:
            self.db.rollback()
            logger.error(f"Error updating product: {str(e)}")
            return ImportResult(
                success=False,
                error=f"خطا در به‌روزرسانی محصول: {str(e)}",
                product_id=product.id
            )
    
    def ensure_unique_slug(self, base_slug: str, product_id: Optional[int] = None) -> str:
        """اطمینان از یکتا بودن slug"""
        slug = base_slug
        counter = 1
        
        while True:
            query = self.db.query(Product).filter(Product.slug == slug)
            if product_id:
                query = query.filter(Product.id != product_id)
            
            if not query.first():
                return slug
            
            slug = f"{base_slug}-{counter}"
            counter += 1
    
    def generate_slug(self, text: str) -> str:
        """ایجاد slug از متن فارسی"""
        # Remove special characters and replace spaces with dashes
        slug = re.sub(r'[^\w\s-]', '', text.strip())
        slug = re.sub(r'[\s_-]+', '-', slug)
        return slug.lower()[:50]  # Limit length
    
    def parse_boolean(self, value: Any) -> bool:
        """تبدیل مقدار به boolean"""
        if isinstance(value, bool):
            return value
        
        if isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'فعال', 'بله']
        
        if isinstance(value, (int, float)):
            return bool(value)
        
        return True  # Default to True
    
    def is_valid_url(self, url: str) -> bool:
        """بررسی معتبر بودن URL"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    async def download_product_image(self, image_url: str, product_name: str) -> Optional[str]:
        """دانلود تصویر محصول"""
        try:
            # Skip download for now - just validate URL
            # In production, implement actual image download and storage
            if self.is_valid_url(image_url):
                return image_url
            return None
            
        except Exception as e:
            logger.error(f"Error downloading image {image_url}: {str(e)}")
            return None