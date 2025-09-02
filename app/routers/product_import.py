import io
import csv
import pandas as pd
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
import logging
import uuid
import os
import requests
from urllib.parse import urlparse
import mimetypes

from app.database import get_db
from app.models import Product, User, ImportLog
from app.schemas import ImportResponse, ImportResult, ProductImport
from app.auth import get_current_user, require_admin
from app.utils.product_import import ProductImportProcessor

router = APIRouter(prefix="/api/v1/admin/import", tags=["product-import"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# In-memory storage for import progress (in production, use Redis or database)
import_progress = {}

@router.post("/products/upload", response_model=ImportResponse)
async def upload_products_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """آپلود فایل CSV/Excel برای import محصولات"""
    
    # Check file type
    if not file.filename.lower().endswith(('.csv', '.xlsx', '.xls')):
        raise HTTPException(
            status_code=400,
            detail="فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل CSV یا Excel ارسال کنید"
        )
    
    # Check file size (max 10MB)
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="حجم فایل بیش از 10 مگابایت است"
        )
    
    # Generate unique import ID
    import_id = str(uuid.uuid4())
    
    # Initialize progress tracking
    import_progress[import_id] = {
        "status": "processing",
        "progress": 0,
        "total": 0,
        "processed": 0,
        "errors": [],
        "success_count": 0,
        "error_count": 0,
        "created_at": datetime.now()
    }
    
    # Create import log entry
    import_log = ImportLog(
        id=import_id,
        user_id=current_user.id,
        filename=file.filename,
        file_size=len(content),
        status="processing",
        created_at=datetime.now()
    )
    db.add(import_log)
    db.commit()
    
    # Process file in background
    background_tasks.add_task(
        process_import_file,
        import_id=import_id,
        content=content,
        filename=file.filename,
        user_id=current_user.id,
        db_url=db.get_bind().url
    )
    
    return ImportResponse(
        import_id=import_id,
        message="فایل با موفقیت آپلود شد. پردازش در حال انجام است",
        status="processing"
    )

@router.get("/products/status/{import_id}")
async def get_import_status(
    import_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """دریافت وضعیت فرآیند import"""
    
    if import_id not in import_progress:
        # Check database for completed imports
        import_log = db.query(ImportLog).filter(ImportLog.id == import_id).first()
        if not import_log:
            raise HTTPException(status_code=404, detail="فرآیند import یافت نشد")
        
        return {
            "import_id": import_id,
            "status": import_log.status,
            "message": import_log.error_message or "تکمیل شده",
            "success_count": import_log.success_count,
            "error_count": import_log.error_count,
            "created_at": import_log.created_at
        }
    
    progress_data = import_progress[import_id]
    return {
        "import_id": import_id,
        "status": progress_data["status"],
        "progress": progress_data["progress"],
        "total": progress_data["total"],
        "processed": progress_data["processed"],
        "success_count": progress_data["success_count"],
        "error_count": progress_data["error_count"],
        "errors": progress_data["errors"][-10:],  # Last 10 errors
        "created_at": progress_data["created_at"]
    }

@router.get("/products/history")
async def get_import_history(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """دریافت تاریخچه import های محصولات"""
    
    imports = db.query(ImportLog)\
        .order_by(ImportLog.created_at.desc())\
        .offset(offset)\
        .limit(limit)\
        .all()
    
    total = db.query(ImportLog).count()
    
    return {
        "imports": imports,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@router.post("/products/template")
async def download_template(current_user: User = Depends(require_admin)):
    """دانلود فایل نمونه برای import محصولات"""
    
    # Create sample CSV data
    sample_data = [
        {
            "name": "محصول نمونه 1",
            "description": "توضیحات محصول نمونه",
            "price": "150000",
            "stock_quantity": "10",
            "category": "لوازم خانگی",
            "image_url": "https://example.com/image1.jpg",
            "sku": "SAMPLE001",
            "is_active": "true"
        },
        {
            "name": "محصول نمونه 2", 
            "description": "توضیحات محصول دوم",
            "price": "250000",
            "stock_quantity": "5",
            "category": "پوشاک",
            "image_url": "https://example.com/image2.jpg",
            "sku": "SAMPLE002",
            "is_active": "true"
        }
    ]
    
    # Create CSV content
    output = io.StringIO()
    fieldnames = sample_data[0].keys()
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(sample_data)
    csv_content = output.getvalue()
    
    return JSONResponse(
        content={"csv_content": csv_content, "filename": "product_import_template.csv"},
        headers={
            "Content-Type": "application/json",
            "Content-Disposition": "attachment; filename=product_import_template.csv"
        }
    )

async def process_import_file(
    import_id: str,
    content: bytes,
    filename: str,
    user_id: int,
    db_url: str
):
    """پردازش فایل import در پس‌زمینه"""
    
    from app.database import SessionLocal
    db = SessionLocal()
    
    try:
        processor = ProductImportProcessor(db)
        
        # Update progress
        import_progress[import_id]["status"] = "processing"
        
        # Parse file content
        if filename.lower().endswith('.csv'):
            # Handle CSV
            content_str = content.decode('utf-8-sig')  # Handle BOM
            reader = csv.DictReader(io.StringIO(content_str))
            rows = list(reader)
        else:
            # Handle Excel
            df = pd.read_excel(io.BytesIO(content))
            rows = df.to_dict('records')
        
        total_rows = len(rows)
        import_progress[import_id]["total"] = total_rows
        
        success_count = 0
        error_count = 0
        errors = []
        
        for i, row in enumerate(rows):
            try:
                result = await processor.process_product_row(row, user_id)
                if result.success:
                    success_count += 1
                else:
                    error_count += 1
                    errors.append(f"سطر {i+2}: {result.error}")
                    
            except Exception as e:
                error_count += 1
                errors.append(f"سطر {i+2}: خطا در پردازش - {str(e)}")
            
            # Update progress
            processed = i + 1
            progress = int((processed / total_rows) * 100)
            import_progress[import_id].update({
                "processed": processed,
                "progress": progress,
                "success_count": success_count,
                "error_count": error_count,
                "errors": errors
            })
        
        # Mark as completed
        import_progress[import_id]["status"] = "completed"
        
        # Update database
        import_log = db.query(ImportLog).filter(ImportLog.id == import_id).first()
        if import_log:
            import_log.status = "completed"
            import_log.success_count = success_count
            import_log.error_count = error_count
            import_log.completed_at = datetime.now()
            if errors:
                import_log.error_message = "; ".join(errors[:5])  # First 5 errors
            db.commit()
        
        logger.info(f"Import {import_id} completed: {success_count} success, {error_count} errors")
        
    except Exception as e:
        logger.error(f"Import {import_id} failed: {str(e)}")
        import_progress[import_id]["status"] = "failed"
        import_progress[import_id]["errors"].append(f"خطای کلی: {str(e)}")
        
        # Update database
        import_log = db.query(ImportLog).filter(ImportLog.id == import_id).first()
        if import_log:
            import_log.status = "failed"
            import_log.error_message = str(e)
            import_log.completed_at = datetime.now()
            db.commit()
    
    finally:
        db.close()
        # Clean up progress after 1 hour
        import asyncio
        await asyncio.sleep(3600)
        if import_id in import_progress:
            del import_progress[import_id]