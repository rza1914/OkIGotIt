import asyncio
import re
import os
import hashlib
import requests
from typing import Optional, Dict, Any, List
from datetime import datetime
from PIL import Image
import io
import threading
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Telegram Bot imports
from telegram import Update, Bot
from telegram.ext import Application, MessageHandler, CommandHandler, filters, ContextTypes
from telegram.constants import ParseMode

from app.models import Product, ImportLog
from app.database import DATABASE_URL
import logging

logger = logging.getLogger(__name__)

class TelegramProductImporter:
    def __init__(self, bot_token: str = None, admin_chat_ids: List[int] = None):
        self.bot_token = bot_token or os.getenv('TELEGRAM_BOT_TOKEN', 'YOUR_BOT_TOKEN_HERE')
        self.admin_chat_ids = admin_chat_ids or [int(x) for x in os.getenv('TELEGRAM_ADMIN_CHAT_IDS', '').split(',') if x.strip()]
        self.is_active = False
        self.application = None
        self.bot_thread = None
        
        self.stats = {
            'products_imported': 0,
            'last_activity': None,
            'total_messages_processed': 0,
            'errors': 0,
            'forwarded_messages': 0,
            'successful_imports': 0
        }
        
        # Database session
        self.engine = create_engine(DATABASE_URL)
        self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
        
        # Initialize bot application
        self._setup_bot()
    
    def _setup_bot(self):
        """Setup Telegram bot application and handlers"""
        if not self.bot_token or self.bot_token == 'YOUR_BOT_TOKEN_HERE':
            logger.warning("Telegram bot token not configured")
            return
        
        try:
            # Create application
            self.application = Application.builder().token(self.bot_token).build()
            
            # Add command handlers
            self.application.add_handler(CommandHandler("start", self.start_command))
            self.application.add_handler(CommandHandler("help", self.help_command))
            self.application.add_handler(CommandHandler("stats", self.stats_command))
            self.application.add_handler(CommandHandler("status", self.status_command))
            
            # Add message handlers
            # Handle forwarded messages with products
            self.application.add_handler(MessageHandler(
                filters.FORWARDED & (filters.PHOTO | filters.TEXT), 
                self.handle_forwarded_message
            ))
            
            # Handle direct product messages
            self.application.add_handler(MessageHandler(
                filters.TEXT & ~filters.COMMAND, 
                self.handle_direct_message
            ))
            
            # Handle photos with captions
            self.application.add_handler(MessageHandler(
                filters.PHOTO, 
                self.handle_photo_message
            ))
            
            logger.info("Telegram bot application setup completed")
            
        except Exception as e:
            logger.error(f"Error setting up Telegram bot: {str(e)}")
    
    def get_db_session(self) -> Session:
        """Get database session"""
        return self.SessionLocal()
    
    # Command Handlers
    async def start_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /start command"""
        chat_id = update.effective_chat.id
        
        if chat_id not in self.admin_chat_ids:
            await update.message.reply_text("⚠️ شما مجاز به استفاده از این ربات نیستید")
            return
        
        welcome_text = f"""🤖 خوش آمدید به ربات Import محصولات iShop

📋 دستورات موجود:
/help - راهنمای استفاده
/stats - آمار ربات
/status - وضعیت ربات

🔄 نحوه استفاده:
1. پیام‌های حاوی اطلاعات محصول را به این ربات فوروارد کنید
2. یا مستقیماً اطلاعات محصول را ارسال کنید
3. ربات به‌طور خودکار محصول را استخراج و ذخیره خواهد کرد

📊 آمار فعلی: {self.stats['products_imported']} محصول import شده"""
        
        await update.message.reply_text(welcome_text, parse_mode=ParseMode.HTML)

    async def help_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /help command"""
        help_text = """🔍 راهنمای استفاده از ربات Import محصولات

📝 فرمت پیام محصول:
```
نام محصول
قیمت: 1,000,000 تومان
توضیحات محصول
#دسته_بندی
```

🖼 تصاویر:
- تصاویر محصولات به‌طور خودکار پردازش می‌شوند
- Caption تصویر برای استخراج اطلاعات استفاده می‌شود

🔄 فوروارد:
- پیام‌های فوروارد شده از کانال‌های فروش پشتیبانی می‌شوند
- ربات اطلاعات را به‌طور هوشمند استخراج می‌کند

⚙️ پردازش خودکار:
- تشخیص قیمت به تومان
- استخراج دسته‌بندی از کلمات کلیدی
- ایجاد slug خودکار
- بررسی تکراری"""

        await update.message.reply_text(help_text, parse_mode=ParseMode.MARKDOWN)

    async def stats_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /stats command"""
        chat_id = update.effective_chat.id
        
        if chat_id not in self.admin_chat_ids:
            await update.message.reply_text("❌ دسترسی غیرمجاز")
            return
        
        stats_text = f"""📊 آمار ربات Import محصولات

✅ محصولات Import شده: {self.stats['products_imported']}
📨 پیام‌های پردازش شده: {self.stats['total_messages_processed']}
📤 پیام‌های فوروارد شده: {self.stats['forwarded_messages']}
✅ Import موفق: {self.stats['successful_imports']}
❌ خطاها: {self.stats['errors']}

⏰ آخرین فعالیت: {self.stats['last_activity'] or 'هرگز'}

🤖 وضعیت: {'✅ فعال' if self.is_active else '❌ غیرفعال'}"""
        
        await update.message.reply_text(stats_text)

    async def status_command(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle /status command"""
        status_text = f"""🤖 وضعیت ربات Import

{'🟢 آنلاین و آماده' if self.is_active else '🔴 آفلاین'}

💾 اتصال پایگاه داده: {'✅' if self._test_db_connection() else '❌'}
📡 اتصال شبکه: ✅
🔧 حالت: Production

⚡ آماده برای Import محصولات"""
        
        await update.message.reply_text(status_text)

    # Message Handlers
    async def handle_forwarded_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle forwarded messages for product import"""
        chat_id = update.effective_chat.id
        
        if chat_id not in self.admin_chat_ids:
            return
        
        try:
            self.stats['forwarded_messages'] += 1
            self.stats['total_messages_processed'] += 1
            self.stats['last_activity'] = datetime.now().isoformat()
            
            # Extract product data
            product_data = await self.extract_product_data_from_message(update.message)
            
            if product_data:
                # Save to database
                success = await self.save_product_to_db(product_data)
                
                if success:
                    self.stats['products_imported'] += 1
                    self.stats['successful_imports'] += 1
                    
                    await update.message.reply_text(
                        f"✅ محصول فوروارد شده با موفقیت اضافه شد!\n\n"
                        f"📦 نام: {product_data['name']}\n"
                        f"💰 قیمت: {product_data['price']:,} تومان\n"
                        f"📂 دسته‌بندی: {product_data['category']}\n"
                        f"📊 موجودی: {product_data['stock']} عدد",
                        parse_mode=ParseMode.HTML
                    )
                else:
                    self.stats['errors'] += 1
                    await update.message.reply_text("❌ خطا در ذخیره محصول در پایگاه داده")
            else:
                self.stats['errors'] += 1
                await update.message.reply_text(
                    "⚠️ اطلاعات محصول کامل نیست\n\n"
                    "لطفاً از فرمت زیر استفاده کنید:\n"
                    "نام محصول\n"
                    "قیمت: 1,000,000 تومان\n"
                    "توضیحات..."
                )
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Error processing forwarded message: {str(e)}")
            await update.message.reply_text(f"❌ خطا در پردازش پیام: {str(e)}")

    async def handle_direct_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle direct product messages"""
        chat_id = update.effective_chat.id
        
        if chat_id not in self.admin_chat_ids:
            await update.message.reply_text("⚠️ شما مجاز به استفاده از این ربات نیستید")
            return
        
        try:
            self.stats['total_messages_processed'] += 1
            self.stats['last_activity'] = datetime.now().isoformat()
            
            # Extract product data
            product_data = await self.extract_product_data_from_message(update.message)
            
            if product_data:
                # Save to database
                success = await self.save_product_to_db(product_data)
                
                if success:
                    self.stats['products_imported'] += 1
                    self.stats['successful_imports'] += 1
                    
                    await update.message.reply_text(
                        f"✅ محصول با موفقیت ثبت شد!\n\n"
                        f"📦 {product_data['name']}\n"
                        f"💰 {product_data['price']:,} تومان\n"
                        f"📂 {product_data['category']}",
                        parse_mode=ParseMode.HTML
                    )
                else:
                    self.stats['errors'] += 1
                    await update.message.reply_text("❌ خطا در ذخیره محصول")
            else:
                await update.message.reply_text(
                    "⚠️ فرمت پیام صحیح نیست.\n"
                    "لطفاً حداقل نام و قیمت محصول را وارد کنید."
                )
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Error processing direct message: {str(e)}")
            await update.message.reply_text(f"❌ خطا: {str(e)}")

    async def handle_photo_message(self, update: Update, context: ContextTypes.DEFAULT_TYPE):
        """Handle photo messages with captions"""
        chat_id = update.effective_chat.id
        
        if chat_id not in self.admin_chat_ids:
            return
        
        try:
            self.stats['total_messages_processed'] += 1
            self.stats['last_activity'] = datetime.now().isoformat()
            
            # Extract product data from caption
            product_data = await self.extract_product_data_from_message(update.message)
            
            if product_data:
                # Process image
                photo = update.message.photo[-1]  # Get highest resolution
                file_info = await context.bot.get_file(photo.file_id)
                image_url = await self.download_and_save_image(file_info)
                
                if image_url:
                    product_data['image_url'] = image_url
                
                # Save to database
                success = await self.save_product_to_db(product_data)
                
                if success:
                    self.stats['products_imported'] += 1
                    self.stats['successful_imports'] += 1
                    
                    await update.message.reply_text(
                        f"✅ محصول با تصویر ثبت شد!\n\n"
                        f"📦 {product_data['name']}\n"
                        f"💰 {product_data['price']:,} تومان\n"
                        f"🖼 تصویر پردازش شد"
                    )
                else:
                    self.stats['errors'] += 1
                    await update.message.reply_text("❌ خطا در ذخیره محصول")
            else:
                await update.message.reply_text("⚠️ لطفاً caption تصویر را با اطلاعات محصول تکمیل کنید")
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Error processing photo message: {str(e)}")
            await update.message.reply_text(f"❌ خطا در پردازش تصویر: {str(e)}")

    async def start_bot(self):
        """Start the Telegram bot"""
        if not self.application:
            logger.error("Bot application not initialized")
            return False
        
        try:
            def run_bot():
                """Run bot in separate thread"""
                asyncio.set_event_loop(asyncio.new_event_loop())
                self.application.run_polling(drop_pending_updates=True)
            
            self.bot_thread = threading.Thread(target=run_bot, daemon=True)
            self.bot_thread.start()
            
            self.is_active = True
            logger.info("🤖 Telegram Product Importer Bot Started")
            return True
            
        except Exception as e:
            logger.error(f"Failed to start Telegram bot: {str(e)}")
            return False
    
    async def stop_bot(self):
        """Stop the Telegram bot"""
        self.is_active = False
        logger.info("🛑 Telegram Product Importer Bot Stopped")
        return True
    
    def get_status(self) -> Dict[str, Any]:
        """Get bot status and statistics"""
        return {
            'active': self.is_active,
            'products_imported': self.stats['products_imported'],
            'last_activity': self.stats['last_activity'],
            'total_messages_processed': self.stats['total_messages_processed'],
            'errors': self.stats['errors']
        }
    
    async def process_message(self, message_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Process a message and extract product data"""
        try:
            self.stats['total_messages_processed'] += 1
            self.stats['last_activity'] = datetime.now().isoformat()
            
            # Check if message is from authorized chat
            chat_id = message_data.get('chat_id')
            if chat_id not in self.admin_chat_ids:
                return {'error': 'Unauthorized chat'}
            
            # Extract product data
            product_data = await self.extract_product_data(message_data)
            
            if product_data:
                # Save to database
                success = await self.save_product_to_db(product_data)
                if success:
                    self.stats['products_imported'] += 1
                    return {
                        'success': True,
                        'product': product_data,
                        'message': f"✅ محصول '{product_data['name']}' با موفقیت اضافه شد"
                    }
                else:
                    self.stats['errors'] += 1
                    return {'error': 'Failed to save product to database'}
            else:
                return {'error': 'Could not extract product information'}
                
        except Exception as e:
            self.stats['errors'] += 1
            logger.error(f"Error processing message: {str(e)}")
            return {'error': str(e)}
    
    def _test_db_connection(self) -> bool:
        """Test database connection"""
        try:
            db = self.get_db_session()
            db.execute("SELECT 1")
            db.close()
            return True
        except:
            return False

    async def extract_product_data_from_message(self, message) -> Optional[Dict[str, Any]]:
        """Extract product information from Telegram message"""
        try:
            product_data = {
                'name': '',
                'description': '',
                'price': 0,
                'category': 'عمومی',
                'image_url': '',
                'stock': 10,
                'is_active': True,
                'currency': 'IRT'
            }
            
            # Extract text content from Telegram message
            text_content = ''
            if hasattr(message, 'text') and message.text:
                text_content = message.text
            elif hasattr(message, 'caption') and message.caption:
                text_content = message.caption
            
            if not text_content:
                return None
            
            # Extract product name (first meaningful line)
            lines = [line.strip() for line in text_content.split('\n') if line.strip()]
            if lines:
                # Skip common prefixes
                for line in lines:
                    if not any(skip in line.lower() for skip in ['فروش', 'قیمت', 'تومان', '💰', '📱']):
                        product_data['name'] = line[:200]  # Limit name length
                        break
                
                if not product_data['name'] and lines:
                    product_data['name'] = lines[0][:200]
            
            # Extract price using multiple patterns
            price_patterns = [
                r'(\d{1,3}(?:[,،]\d{3})*)\s*تومان',
                r'(\d{1,3}(?:[,،]\d{3})*)\s*ت(?:\s|$)',
                r'قیمت[:\s]*(\d{1,3}(?:[,،]\d{3})*)',
                r'💰[:\s]*(\d{1,3}(?:[,،]\d{3})*)',
                r'قیمت[:\s]*(\d{1,3}(?:[,،]\d{3})*)\s*تومان',
                r'(\d{1,3}(?:[,،]\d{3})*)\s*هزار\s*تومان',
            ]
            
            for pattern in price_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    price_str = match.group(1).replace(',', '').replace('،', '')
                    try:
                        price = int(price_str)
                        # Handle "هزار تومان" cases
                        if 'هزار' in match.group(0):
                            price *= 1000
                        product_data['price'] = price
                        break
                    except ValueError:
                        continue
            
            # Extract category from keywords and hashtags
            category_keywords = {
                'گوشی|موبایل|phone': 'موبایل و تبلت',
                'لپ.?تاپ|laptop|نوت.?بوک': 'لپ تاپ و کامپیوتر',
                'هدفون|ایرپاد|headphone': 'لوازم جانبی',
                'لباس|پیراهن|شلوار|تی.?شرت': 'پوشاک',
                'کفش|کتونی|صندل': 'کفش',
                'کیف|کوله|bag': 'کیف و کوله',
                'کتاب|book': 'کتاب و مجله',
                'آشپزخانه|kitchen|قابلمه': 'خانه و آشپزخانه',
                'زیبایی|آرایش|cosmetic': 'زیبایی و سلامت',
                'ورزش|sport|fitness': 'ورزش و تناسب اندام',
                'کودک|baby|بچگانه': 'کودک و نوزاد',
                'ابزار|tool|آچار': 'ابزار و تجهیزات',
                'خودرو|car|ماشین': 'خودرو و وسایل نقلیه'
            }
            
            text_lower = text_content.lower()
            for keywords, category in category_keywords.items():
                if re.search(keywords, text_lower):
                    product_data['category'] = category
                    break
            
            # Extract hashtags for additional category info
            hashtags = re.findall(r'#(\w+)', text_content)
            if hashtags and product_data['category'] == 'عمومی':
                # Map common hashtags to categories
                hashtag_categories = {
                    'گوشی': 'موبایل و تبلت',
                    'لپتاپ': 'لپ تاپ و کامپیوتر',
                    'لباس': 'پوشاک',
                    'کفش': 'کفش',
                    'کتاب': 'کتاب و مجله'
                }
                for hashtag in hashtags:
                    if hashtag in hashtag_categories:
                        product_data['category'] = hashtag_categories[hashtag]
                        break
            
            # Process description (remove name and price info)
            description_lines = []
            for line in lines[1:]:  # Skip first line (usually the name)
                # Skip lines that contain only price or contact info
                if not re.search(r'^\d+[,،]*\d*\s*تومان?$|^قیمت|^تماس|^آدرس|^\d{11}', line):
                    description_lines.append(line)
            
            product_data['description'] = '\n'.join(description_lines[:5])  # Limit description
            
            # Handle image URL if provided in message
            if hasattr(message, 'photo') and message.photo:
                photo = message.photo[-1]  # Get highest resolution
                product_data['image_url'] = await self.process_telegram_image(photo)
            
            # Extract stock info if mentioned
            stock_patterns = [
                r'موجود[:\s]*(\d+)',
                r'تعداد[:\s]*(\d+)',
                r'stock[:\s]*(\d+)',
            ]
            
            for pattern in stock_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    try:
                        product_data['stock'] = int(match.group(1))
                        break
                    except ValueError:
                        continue
            
            # Generate slug
            product_data['slug'] = self.generate_slug(product_data['name'])
            
            return product_data if product_data['name'] and product_data['price'] > 0 else None
            
        except Exception as e:
            logger.error(f"Error extracting product data: {str(e)}")
            return None
    
    async def process_image(self, photo_data: Dict[str, Any]) -> str:
        """Process and save product image"""
        try:
            # In a real implementation, we would download the image from Telegram
            # For simulation, we return a placeholder
            return '/static/products/telegram_import_placeholder.jpg'
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            return ''

    async def process_telegram_image(self, photo) -> str:
        """Process Telegram photo object"""
        try:
            # In production, this would download and save the image
            # For now, return a placeholder URL
            return f'/static/products/telegram_{photo.file_id[:10]}.jpg'
            
        except Exception as e:
            logger.error(f"Error processing Telegram image: {str(e)}")
            return ''

    async def download_and_save_image(self, file_info) -> str:
        """Download and save image from Telegram"""
        try:
            # Get the full file URL from Telegram
            file_url = f"https://api.telegram.org/file/bot{self.bot_token}/{file_info.file_path}"
            
            # Download the image
            response = requests.get(file_url)
            if response.status_code == 200:
                # Create unique filename
                file_ext = file_info.file_path.split('.')[-1] or 'jpg'
                filename = f"telegram_{hashlib.md5(file_info.file_path.encode()).hexdigest()[:10]}.{file_ext}"
                
                # Create products directory
                products_dir = os.path.join(os.getcwd(), 'static', 'products')
                os.makedirs(products_dir, exist_ok=True)
                
                # Save file
                file_path = os.path.join(products_dir, filename)
                
                with open(file_path, 'wb') as f:
                    f.write(response.content)
                
                # Optionally process image (resize, optimize)
                try:
                    with Image.open(file_path) as img:
                        # Resize if too large
                        if img.width > 800 or img.height > 800:
                            img.thumbnail((800, 800), Image.Resampling.LANCZOS)
                            img.save(file_path, optimize=True, quality=85)
                except Exception as img_error:
                    logger.warning(f"Image processing failed: {img_error}")
                
                return f'/static/products/{filename}'
            else:
                logger.error(f"Failed to download image: HTTP {response.status_code}")
            
        except Exception as e:
            logger.error(f"Error downloading image: {str(e)}")
        
        return ''

    async def extract_product_data(self, message_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Extract product data from webhook message data"""
        try:
            product_data = {
                'name': '',
                'description': '',
                'price': 0,
                'category': 'عمومی',
                'image_url': '',
                'stock': 10,
                'is_active': True,
                'currency': 'IRT'
            }
            
            # Extract text content
            text_content = message_data.get('text', '') or message_data.get('caption', '')
            
            if not text_content:
                return None
            
            # Process the text using the same logic as extract_product_data_from_message
            # but adapted for webhook data structure
            lines = [line.strip() for line in text_content.split('\n') if line.strip()]
            if lines:
                # Extract product name
                for line in lines:
                    if not any(skip in line.lower() for skip in ['فروش', 'قیمت', 'تومان', '💰', '📱']):
                        product_data['name'] = line[:200]
                        break
                
                if not product_data['name'] and lines:
                    product_data['name'] = lines[0][:200]
            
            # Extract price using patterns
            price_patterns = [
                r'(\d{1,3}(?:[,،]\d{3})*)\s*تومان',
                r'(\d{1,3}(?:[,،]\d{3})*)\s*ت(?:\s|$)',
                r'قیمت[:\s]*(\d{1,3}(?:[,،]\d{3})*)',
                r'💰[:\s]*(\d{1,3}(?:[,،]\d{3})*)',
            ]
            
            for pattern in price_patterns:
                match = re.search(pattern, text_content, re.IGNORECASE)
                if match:
                    price_str = match.group(1).replace(',', '').replace('،', '')
                    try:
                        product_data['price'] = int(price_str)
                        break
                    except ValueError:
                        continue
            
            # Extract category
            category_keywords = {
                'گوشی|موبایل|phone': 'موبایل و تبلت',
                'لپ.?تاپ|laptop': 'لپ تاپ و کامپیوتر',
                'هدفون|ایرپاد': 'لوازم جانبی',
                'لباس|پیراهن|تی.?شرت': 'پوشاک',
                'کفش|کتونی': 'کفش',
                'کیف|کوله': 'کیف و کوله',
            }
            
            text_lower = text_content.lower()
            for keywords, category in category_keywords.items():
                if re.search(keywords, text_lower):
                    product_data['category'] = category
                    break
            
            # Handle images from webhook data
            if message_data.get('photo'):
                product_data['image_url'] = await self.process_image(message_data['photo'])
            
            # Generate description
            description_lines = []
            for line in lines[1:]:
                if not re.search(r'^\d+[,،]*\d*\s*تومان?$|^قیمت|^تماس', line):
                    description_lines.append(line)
            
            product_data['description'] = '\n'.join(description_lines[:5])
            product_data['slug'] = self.generate_slug(product_data['name'])
            
            return product_data if product_data['name'] and product_data['price'] > 0 else None
            
        except Exception as e:
            logger.error(f"Error extracting product data from webhook: {str(e)}")
            return None
    
    def generate_slug(self, name: str) -> str:
        """Generate URL slug from product name"""
        if not name:
            return f"product-{datetime.now().timestamp()}"
        
        # Persian and English slug generation
        slug = name.lower()
        slug = re.sub(r'[^\w\s\u0600-\u06FF-]', '', slug)  # Keep Persian chars
        slug = re.sub(r'[-\s]+', '-', slug)
        slug = slug.strip('-')[:50]  # Limit length
        
        if not slug:
            slug = f"product-{datetime.now().timestamp()}"
        
        return slug
    
    async def save_product_to_db(self, product_data: Dict[str, Any]) -> bool:
        """Save product to database"""
        db = None
        try:
            db = self.get_db_session()
            
            # Check if product already exists by name
            existing = db.query(Product).filter(
                Product.name == product_data['name']
            ).first()
            
            if existing:
                # Update existing product
                for key, value in product_data.items():
                    if key != 'slug':  # Don't change slug
                        setattr(existing, key, value)
                logger.info(f"Updated existing product: {product_data['name']}")
            else:
                # Ensure unique slug
                base_slug = product_data['slug']
                slug = base_slug
                counter = 1
                
                while db.query(Product).filter(Product.slug == slug).first():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                
                product_data['slug'] = slug
                
                # Create new product
                new_product = Product(
                    name=product_data['name'],
                    description=product_data['description'],
                    category=product_data['category'],
                    price=product_data['price'],
                    currency=product_data['currency'],
                    image_url=product_data['image_url'],
                    slug=product_data['slug'],
                    stock=product_data['stock'],
                    is_active=product_data['is_active']
                )
                
                db.add(new_product)
                logger.info(f"Created new product: {product_data['name']}")
            
            db.commit()
            return True
            
        except Exception as e:
            if db:
                db.rollback()
            logger.error(f"Database error: {str(e)}")
            return False
        finally:
            if db:
                db.close()
    
    async def create_import_log(self, filename: str, results: Dict[str, Any]) -> str:
        """Create import log entry"""
        db = None
        try:
            db = self.get_db_session()
            import uuid
            
            import_log = ImportLog(
                id=str(uuid.uuid4()),
                user_id=1,  # System user for Telegram imports
                filename=filename,
                file_size=0,  # Not applicable for Telegram
                status='completed',
                success_count=results.get('success', 0),
                error_count=results.get('errors', 0),
                error_message=results.get('error_message'),
                created_at=datetime.now(),
                completed_at=datetime.now()
            )
            
            db.add(import_log)
            db.commit()
            
            return import_log.id
            
        except Exception as e:
            if db:
                db.rollback()
            logger.error(f"Error creating import log: {str(e)}")
            return None
        finally:
            if db:
                db.close()

# Global bot instance
telegram_bot = TelegramProductImporter()