from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from datetime import datetime, timedelta
import logging

from app.database import get_db
from app.auth import get_current_user, require_admin
from app.models import User, Product, ImportLog
from app.bots.telegram_importer import telegram_bot

router = APIRouter(prefix="/api/v1/bot", tags=["bot-management"])
logger = logging.getLogger(__name__)

@router.get("/status")
async def get_bot_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get comprehensive bot status and statistics"""
    try:
        # Get Telegram bot status
        telegram_status = telegram_bot.get_status()
        
        # Get recent import statistics
        recent_imports = db.query(ImportLog).filter(
            ImportLog.created_at >= datetime.now() - timedelta(days=7)
        ).all()
        
        # Get total products
        total_products = db.query(Product).count()
        recent_products = db.query(Product).filter(
            Product.created_at >= datetime.now() - timedelta(days=7)
        ).count()
        
        return {
            "telegram_bot": {
                "status": "active" if telegram_status['active'] else "inactive",
                "products_imported": telegram_status['products_imported'],
                "last_activity": telegram_status['last_activity'],
                "total_messages_processed": telegram_status['total_messages_processed'],
                "errors": telegram_status['errors']
            },
            "csv_importer": {
                "recent_imports": len(recent_imports),
                "total_imported": sum(imp.success_count or 0 for imp in recent_imports),
                "last_import": recent_imports[0].created_at.isoformat() if recent_imports else None
            },
            "general_stats": {
                "total_products": total_products,
                "recent_products": recent_products,
                "active_imports": len([imp for imp in recent_imports if imp.status == 'processing'])
            }
        }
        
    except Exception as e:
        logger.error(f"Error getting bot status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/telegram/start")
async def start_telegram_bot(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_admin)
):
    """Start the Telegram bot"""
    try:
        success = await telegram_bot.start_bot()
        
        if success:
            # Log the start event
            logger.info(f"Telegram bot started by user {current_user.username}")
            return {
                "success": True,
                "message": "ربات تلگرام با موفقیت شروع شد",
                "status": "active"
            }
        else:
            raise HTTPException(status_code=500, detail="خطا در شروع ربات تلگرام")
            
    except Exception as e:
        logger.error(f"Error starting Telegram bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"خطا در شروع ربات: {str(e)}")

@router.post("/telegram/stop")
async def stop_telegram_bot(
    current_user: User = Depends(require_admin)
):
    """Stop the Telegram bot"""
    try:
        success = await telegram_bot.stop_bot()
        
        if success:
            logger.info(f"Telegram bot stopped by user {current_user.username}")
            return {
                "success": True,
                "message": "ربات تلگرام با موفقیت متوقف شد",
                "status": "inactive"
            }
        else:
            raise HTTPException(status_code=500, detail="خطا در متوقف کردن ربات تلگرام")
            
    except Exception as e:
        logger.error(f"Error stopping Telegram bot: {str(e)}")
        raise HTTPException(status_code=500, detail=f"خطا در توقف ربات: {str(e)}")

@router.post("/telegram/process-message")
async def process_telegram_message(
    message_data: Dict[str, Any],
    background_tasks: BackgroundTasks,
    current_user: User = Depends(require_admin)
):
    """Process a Telegram message for product import (for testing/webhook)"""
    try:
        result = await telegram_bot.process_message(message_data)
        
        if result.get('success'):
            return {
                "success": True,
                "message": result['message'],
                "product": result['product']
            }
        else:
            return {
                "success": False,
                "error": result.get('error', 'Unknown error')
            }
            
    except Exception as e:
        logger.error(f"Error processing Telegram message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/telegram/stats")
async def get_telegram_stats(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get detailed Telegram bot statistics"""
    try:
        # Get bot status
        bot_status = telegram_bot.get_status()
        
        # Get products imported via Telegram (assuming we track source)
        recent_date = datetime.now() - timedelta(days=days)
        recent_products = db.query(Product).filter(
            Product.created_at >= recent_date
        ).all()
        
        # Calculate daily stats
        daily_stats = {}
        for i in range(days):
            date = datetime.now().date() - timedelta(days=i)
            daily_products = [
                p for p in recent_products 
                if p.created_at.date() == date
            ]
            daily_stats[date.isoformat()] = len(daily_products)
        
        return {
            "bot_status": bot_status,
            "daily_imports": daily_stats,
            "total_recent": len(recent_products),
            "categories_distribution": _get_category_distribution(recent_products),
            "average_price": _get_average_price(recent_products)
        }
        
    except Exception as e:
        logger.error(f"Error getting Telegram stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/import-history")
async def get_import_history(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Get import history for all bot types"""
    try:
        imports = db.query(ImportLog)\
            .order_by(ImportLog.created_at.desc())\
            .offset(offset)\
            .limit(limit)\
            .all()
        
        total = db.query(ImportLog).count()
        
        # Format import data
        formatted_imports = []
        for imp in imports:
            formatted_imports.append({
                "id": imp.id,
                "filename": imp.filename,
                "file_size": imp.file_size,
                "status": imp.status,
                "success_count": imp.success_count,
                "error_count": imp.error_count,
                "error_message": imp.error_message,
                "created_at": imp.created_at.isoformat(),
                "completed_at": imp.completed_at.isoformat() if imp.completed_at else None,
                "duration": _calculate_duration(imp.created_at, imp.completed_at) if imp.completed_at else None
            })
        
        return {
            "imports": formatted_imports,
            "total": total,
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        logger.error(f"Error getting import history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/import-history/{import_id}")
async def delete_import_log(
    import_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Delete an import log entry"""
    try:
        import_log = db.query(ImportLog).filter(ImportLog.id == import_id).first()
        
        if not import_log:
            raise HTTPException(status_code=404, detail="Import log not found")
        
        db.delete(import_log)
        db.commit()
        
        return {"success": True, "message": "گزارش import حذف شد"}
        
    except Exception as e:
        logger.error(f"Error deleting import log: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/test-product-extraction")
async def test_product_extraction(
    test_data: Dict[str, Any],
    current_user: User = Depends(require_admin)
):
    """Test product data extraction from message (for development)"""
    try:
        extracted_data = await telegram_bot.extract_product_data(test_data)
        
        return {
            "success": True,
            "extracted_data": extracted_data,
            "message": "استخراج اطلاعات محصول با موفقیت انجام شد"
        }
        
    except Exception as e:
        logger.error(f"Error testing product extraction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

def _get_category_distribution(products: List[Product]) -> Dict[str, int]:
    """Get distribution of products by category"""
    distribution = {}
    for product in products:
        category = product.category or 'عمومی'
        distribution[category] = distribution.get(category, 0) + 1
    return distribution

def _get_average_price(products: List[Product]) -> float:
    """Get average price of products"""
    if not products:
        return 0.0
    
    total_price = sum(product.price for product in products)
    return total_price / len(products)

def _calculate_duration(start_time: datetime, end_time: datetime) -> str:
    """Calculate duration between two datetime objects"""
    if not start_time or not end_time:
        return None
    
    duration = end_time - start_time
    seconds = int(duration.total_seconds())
    
    if seconds < 60:
        return f"{seconds} ثانیه"
    elif seconds < 3600:
        minutes = seconds // 60
        return f"{minutes} دقیقه"
    else:
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        return f"{hours} ساعت و {minutes} دقیقه"