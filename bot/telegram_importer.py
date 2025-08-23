import os
import re
import json
import asyncio
import logging
from typing import Optional, Dict, Any
from io import BytesIO

import aiohttp
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from telegram.error import TelegramError

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Environment variables
BOT_TOKEN = os.getenv("BOT_TOKEN")
MAIN_CHANNEL_ID = int(os.getenv("MAIN_CHANNEL_ID", "0"))
ADMIN_CHAT_ID = os.getenv("ADMIN_CHAT_ID")
IMPORTER_TOKEN = os.getenv("IMPORTER_TOKEN", "default_importer_token")
API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000/api/v1")

class PersianMessageParser:
    """Parse Persian messages in different formats to extract product information"""
    
    def __init__(self):
        # Regex patterns
        self.price_pattern = r'([\d\s,\.]+)(?:\s*)(تومان|ت|ریال|\$)?'
        self.name_pattern = r'نام\s*محصول\s*:\s*(.+)'
        self.category_pattern = r'دسته\s*بندی\s*:\s*(.+)'
        self.description_pattern = r'توضیحات\s*:\s*([\s\S]+)'
        self.hashtag_pattern = r'#(\w+)'
    
    def digits_fa_to_en(self, text: str) -> str:
        """Convert Persian/Arabic digits to English"""
        persian_digits = '۰۱۲۳۴۵۶۷۸۹'
        arabic_digits = '٠١٢٣٤٥٦٧٨٩'
        english_digits = '0123456789'
        
        for i, persian in enumerate(persian_digits):
            text = text.replace(persian, english_digits[i])
        for i, arabic in enumerate(arabic_digits):
            text = text.replace(arabic, english_digits[i])
        
        return text
    
    def extract_price(self, text: str) -> tuple[int, str]:
        """Extract price and currency from text"""
        text = self.digits_fa_to_en(text)
        
        matches = re.findall(self.price_pattern, text)
        if not matches:
            return 0, "IRT"
        
        # Get the last price match (usually the final price)
        price_str, currency = matches[-1]
        
        # Clean price string
        price_str = re.sub(r'[,\s\.]', '', price_str)
        try:
            price = int(price_str)
        except ValueError:
            return 0, "IRT"
        
        # Determine currency
        if currency in ['ریال']:
            price = price // 10  # Convert Rial to Toman
            currency = "IRT"
        elif currency == '$':
            currency = "USD"
        else:
            currency = "IRT"  # Default to Toman
        
        return price, currency
    
    def parse_keyword_format(self, text: str) -> Optional[Dict[str, Any]]:
        """Parse keyword-based format"""
        name_match = re.search(self.name_pattern, text, re.IGNORECASE)
        category_match = re.search(self.category_pattern, text, re.IGNORECASE)
        description_match = re.search(self.description_pattern, text, re.IGNORECASE | re.DOTALL)
        
        if not name_match:
            return None
        
        price, currency = self.extract_price(text)
        
        return {
            'name': name_match.group(1).strip(),
            'category': category_match.group(1).strip() if category_match else None,
            'description': description_match.group(1).strip() if description_match else None,
            'price': price,
            'currency': currency
        }
    
    def parse_hashtag_format(self, text: str) -> Optional[Dict[str, Any]]:
        """Parse hashtag + price format"""
        lines = text.strip().split('\n')
        if len(lines) < 3:
            return None
        
        # First line is name
        name = lines[0].strip()
        
        # Find hashtags
        hashtags = re.findall(self.hashtag_pattern, text)
        category = ' '.join(hashtags) if hashtags else None
        
        # Last line should contain price
        price, currency = self.extract_price(lines[-1])
        if price == 0:
            return None
        
        # Middle lines are description (excluding hashtag line)
        description_lines = []
        for line in lines[1:-1]:
            if not re.search(self.hashtag_pattern, line):
                description_lines.append(line.strip())
        
        description = ' '.join(description_lines) if description_lines else None
        
        return {
            'name': name,
            'category': category,
            'description': description,
            'price': price,
            'currency': currency
        }
    
    def parse_compressed_format(self, text: str) -> Optional[Dict[str, Any]]:
        """Parse compressed format: name | category | price | description"""
        parts = [part.strip() for part in text.split('|')]
        if len(parts) < 3:
            return None
        
        name = parts[0]
        category = parts[1] if len(parts) > 1 else None
        
        # Try to parse price from third part
        price_text = parts[2] if len(parts) > 2 else ""
        price, currency = self.extract_price(price_text)
        
        description = parts[3] if len(parts) > 3 else None
        
        return {
            'name': name,
            'category': category,
            'description': description,
            'price': price,
            'currency': currency
        }
    
    def parse_message(self, text: str) -> Optional[Dict[str, Any]]:
        """Try to parse message in any supported format"""
        if not text:
            return None
        
        # Try keyword format first
        result = self.parse_keyword_format(text)
        if result:
            return result
        
        # Try hashtag format
        result = self.parse_hashtag_format(text)
        if result:
            return result
        
        # Try compressed format
        result = self.parse_compressed_format(text)
        if result:
            return result
        
        return None


class TelegramImporter:
    def __init__(self):
        self.parser = PersianMessageParser()
        self.session: Optional[aiohttp.ClientSession] = None
    
    async def get_session(self) -> aiohttp.ClientSession:
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session
    
    async def close_session(self):
        if self.session and not self.session.closed:
            await self.session.close()
    
    async def download_image(self, context: ContextTypes.DEFAULT_TYPE, file_id: str) -> Optional[bytes]:
        """Download image from Telegram"""
        try:
            file = await context.bot.get_file(file_id)
            file_data = BytesIO()
            await file.download_to_memory(file_data)
            return file_data.getvalue()
        except Exception as e:
            logger.error(f"Failed to download image: {e}")
            return None
    
    async def create_product(self, product_data: Dict[str, Any], image_data: Optional[bytes] = None) -> Dict[str, Any]:
        """Create product via API"""
        session = await self.get_session()
        
        url = f"{API_BASE}/products"
        headers = {
            'X-Importer-Key': IMPORTER_TOKEN
        }
        
        # Prepare multipart data
        data = aiohttp.FormData()
        data.add_field('name', product_data['name'])
        data.add_field('price', str(product_data['price']))
        data.add_field('currency', product_data['currency'])
        data.add_field('stock', '0')
        data.add_field('is_active', 'true')
        
        if product_data.get('description'):
            data.add_field('description', product_data['description'])
        
        if product_data.get('category'):
            data.add_field('category', product_data['category'])
        
        if image_data:
            data.add_field('image_file', image_data, 
                          filename='product_image.jpg',
                          content_type='image/jpeg')
        
        try:
            async with session.post(url, headers=headers, data=data) as response:
                response.raise_for_status()
                return await response.json()
        except aiohttp.ClientError as e:
            logger.error(f"API request failed: {e}")
            raise
    
    async def send_admin_notification(self, context: ContextTypes.DEFAULT_TYPE, message: str):
        """Send notification to admin"""
        if ADMIN_CHAT_ID:
            try:
                await context.bot.send_message(chat_id=ADMIN_CHAT_ID, text=message)
            except Exception as e:
                logger.error(f"Failed to send admin notification: {e}")


# Bot handlers
importer = TelegramImporter()

async def ping_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /ping command"""
    await update.message.reply_text("pong")

async def help_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command"""
    help_text = """🤖 راهنمای ربات واردکننده محصولات

برای اضافه کردن محصول جدید، پیامی از کانال اصلی را فوروارد کنید.

📋 فرمت‌های پشتیبانی شده:

1️⃣ فرمت کلیدواژه‌ای:
نام محصول: کیف دستی رزگلد
دسته‌بندی: کیف زنانه  
قیمت: 1,250,000 تومان
توضیحات: چرم طبیعی، بند طلایی

2️⃣ فرمت هاشتگ:
کیف دستی رزگلد
چرم طبیعی، بند طلایی
#کیف #زنانه
1,250,000 تومان

3️⃣ فرمت فشرده:
کیف دستی رزگلد | کیف زنانه | 1250000 | چرم طبیعی

دستورات:
/ping - تست ربات
/help - نمایش این راهنما
"""
    await update.message.reply_text(help_text)


async def message_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle forwarded messages"""
    message = update.message
    
    # Only process forwarded messages from main channel
    if not message.forward_from_chat or message.forward_from_chat.id != MAIN_CHANNEL_ID:
        await message.reply_text("❌ فقط پیام‌های فوروارد شده از کانال اصلی پردازش می‌شوند.")
        return
    
    try:
        # Extract text from message
        text = message.caption or message.text
        if not text:
            await message.reply_text("❌ پیام باید متن یا کپشن داشته باشد.")
            return
        
        # Parse message
        product_data = importer.parser.parse_message(text)
        if not product_data:
            await message.reply_text("❌ نتوانستم اطلاعات محصول را استخراج کنم. لطفاً فرمت پیام را بررسی کنید.")
            return
        
        # Download image if available
        image_data = None
        if message.photo:
            largest_photo = message.photo[-1]  # Get largest size
            image_data = await importer.download_image(context, largest_photo.file_id)
        
        # Create product
        result = await importer.create_product(product_data, image_data)
        
        success_msg = f"""✅ محصول با موفقیت اضافه شد!
        
🆔 ID: {result['id']}
📝 نام: {result['name']}
💰 قیمت: {result['price']} {result['currency']}
📂 دسته‌بندی: {result.get('category', 'نامشخص')}
📊 موجودی: {result['stock']}
"""
        
        await message.reply_text(success_msg)
        
        # Send notification to admin
        admin_msg = f"محصول جدید اضافه شد: {result['name']} - {result['price']} {result['currency']}"
        await importer.send_admin_notification(context, admin_msg)
        
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        error_msg = f"❌ خطا در پردازش پیام: {str(e)}"
        await message.reply_text(error_msg)
        
        # Notify admin of error
        admin_error = f"خطا در پردازش پیام: {str(e)}\nمتن پیام: {text[:100]}..."
        await importer.send_admin_notification(context, admin_error)


async def main():
    """Main function to run the bot"""
    if not BOT_TOKEN:
        logger.error("BOT_TOKEN environment variable not set")
        return
    
    if MAIN_CHANNEL_ID == 0:
        logger.error("MAIN_CHANNEL_ID environment variable not set or invalid")
        return
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("ping", ping_handler))
    application.add_handler(CommandHandler("help", help_handler))
    application.add_handler(CommandHandler("start", help_handler))
    application.add_handler(MessageHandler(filters.ALL, message_handler))
    
    # Start the bot
    logger.info("Starting Telegram bot...")
    
    try:
        await application.initialize()
        await application.start()
        await application.updater.start_polling()
        
        # Keep running
        await asyncio.Event().wait()
        
    except KeyboardInterrupt:
        logger.info("Bot stopped by user")
    except Exception as e:
        logger.error(f"Bot error: {e}")
    finally:
        await application.stop()
        await importer.close_session()


if __name__ == "__main__":
    asyncio.run(main())
