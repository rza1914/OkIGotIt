from fastapi import APIRouter, Request, HTTPException, Depends
from sqlalchemy.orm import Session
import logging
import json
from typing import Dict, Any

from app.database import get_db
from app.bots.telegram_importer import telegram_bot

router = APIRouter(prefix="/api/v1/telegram", tags=["telegram-webhook"])
logger = logging.getLogger(__name__)

@router.post("/webhook/{bot_token}")
async def telegram_webhook(
    bot_token: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Telegram webhook updates"""
    
    # Verify bot token
    if bot_token != telegram_bot.bot_token:
        logger.warning(f"Invalid bot token received: {bot_token}")
        raise HTTPException(status_code=403, detail="Invalid bot token")
    
    try:
        # Parse webhook data
        update_data = await request.json()
        logger.info(f"Received Telegram update: {json.dumps(update_data, indent=2)}")
        
        # Process the update
        result = await process_telegram_update(update_data)
        
        return {"status": "ok", "result": result}
        
    except Exception as e:
        logger.error(f"Error processing Telegram webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webhook/set")
async def set_webhook(webhook_data: Dict[str, Any]):
    """Set webhook URL for Telegram bot"""
    
    webhook_url = webhook_data.get("webhook_url")
    if not webhook_url:
        raise HTTPException(status_code=400, detail="webhook_url is required")
    
    try:
        import requests
        
        # Set webhook using Telegram Bot API
        telegram_api_url = f"https://api.telegram.org/bot{telegram_bot.bot_token}/setWebhook"
        
        response = requests.post(telegram_api_url, json={
            "url": webhook_url,
            "allowed_updates": ["message", "edited_message", "channel_post", "edited_channel_post"]
        })
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ok"):
                logger.info(f"Webhook set successfully: {webhook_url}")
                return {"success": True, "message": "Webhook set successfully", "result": result}
            else:
                logger.error(f"Failed to set webhook: {result}")
                raise HTTPException(status_code=400, detail=result.get("description", "Unknown error"))
        else:
            logger.error(f"HTTP error setting webhook: {response.status_code}")
            raise HTTPException(status_code=response.status_code, detail="Failed to set webhook")
            
    except Exception as e:
        logger.error(f"Error setting webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/webhook")
async def delete_webhook():
    """Remove webhook for Telegram bot"""
    
    try:
        import requests
        
        # Delete webhook using Telegram Bot API
        telegram_api_url = f"https://api.telegram.org/bot{telegram_bot.bot_token}/deleteWebhook"
        
        response = requests.post(telegram_api_url)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ok"):
                logger.info("Webhook deleted successfully")
                return {"success": True, "message": "Webhook deleted successfully"}
            else:
                logger.error(f"Failed to delete webhook: {result}")
                raise HTTPException(status_code=400, detail=result.get("description", "Unknown error"))
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to delete webhook")
            
    except Exception as e:
        logger.error(f"Error deleting webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/webhook/info")
async def get_webhook_info():
    """Get current webhook information"""
    
    try:
        import requests
        
        # Get webhook info using Telegram Bot API
        telegram_api_url = f"https://api.telegram.org/bot{telegram_bot.bot_token}/getWebhookInfo"
        
        response = requests.get(telegram_api_url)
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ok"):
                return {"success": True, "webhook_info": result.get("result")}
            else:
                raise HTTPException(status_code=400, detail=result.get("description", "Unknown error"))
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to get webhook info")
            
    except Exception as e:
        logger.error(f"Error getting webhook info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

async def process_telegram_update(update_data: Dict[str, Any]) -> Dict[str, Any]:
    """Process incoming Telegram update"""
    
    try:
        # Check if update contains a message
        if "message" in update_data:
            message_data = update_data["message"]
            
            # Create a simulated message object for processing
            class MockMessage:
                def __init__(self, data):
                    self.text = data.get("text")
                    self.caption = data.get("caption")
                    self.chat = type('obj', (object,), {'id': data.get("chat", {}).get("id")})
                    self.from_user = data.get("from")
                    self.message_id = data.get("message_id")
                    self.date = data.get("date")
                    self.forward_from = data.get("forward_from")
                    self.forward_date = data.get("forward_date")
                    self.photo = data.get("photo", [])
            
            mock_message = MockMessage(message_data)
            
            # Check if message is from authorized chat
            chat_id = message_data.get("chat", {}).get("id")
            if chat_id not in telegram_bot.admin_chat_ids:
                logger.warning(f"Unauthorized chat ID: {chat_id}")
                return {"status": "unauthorized", "chat_id": chat_id}
            
            # Process the message
            result = await telegram_bot.process_message({
                "chat_id": chat_id,
                "text": mock_message.text,
                "caption": mock_message.caption,
                "photo": mock_message.photo
            })
            
            return {"status": "processed", "result": result}
        
        return {"status": "ignored", "reason": "No message in update"}
        
    except Exception as e:
        logger.error(f"Error processing Telegram update: {str(e)}")
        return {"status": "error", "error": str(e)}

@router.post("/test/send-message")
async def send_test_message(message_data: Dict[str, Any]):
    """Send a test message through the bot (for development)"""
    
    chat_id = message_data.get("chat_id")
    text = message_data.get("text", "Test message from iShop bot")
    
    if not chat_id:
        raise HTTPException(status_code=400, detail="chat_id is required")
    
    try:
        import requests
        
        # Send message using Telegram Bot API
        telegram_api_url = f"https://api.telegram.org/bot{telegram_bot.bot_token}/sendMessage"
        
        response = requests.post(telegram_api_url, json={
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML"
        })
        
        if response.status_code == 200:
            result = response.json()
            if result.get("ok"):
                return {"success": True, "message": "Test message sent", "result": result}
            else:
                raise HTTPException(status_code=400, detail=result.get("description", "Unknown error"))
        else:
            raise HTTPException(status_code=response.status_code, detail="Failed to send message")
            
    except Exception as e:
        logger.error(f"Error sending test message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))