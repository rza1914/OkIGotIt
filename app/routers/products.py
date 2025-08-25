import os
import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Header, Query
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_, desc, asc
from slugify import slugify

from ..database import get_db
from ..auth import get_current_user, verify_importer_token
from ..models import Product as ProductModel, User
from ..schemas import Product, ProductCreate, ProductUpdate

router = APIRouter()


def save_uploaded_file(file: UploadFile) -> str:
    """Save uploaded file and return the URL"""
    # Create uploads directory if it doesn't exist
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)
    
    # Return URL (assuming the app serves static files from /uploads)
    return f"/uploads/{unique_filename}"


@router.get("", response_model=List[Product])
def get_products(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    query: str = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    db_query = db.query(ProductModel)
    
    if active_only:
        db_query = db_query.filter(ProductModel.is_active == True)
    
    if category:
        db_query = db_query.filter(ProductModel.category == category)
    
    # Search functionality
    if query and len(query.strip()) >= 2:
        search_term = f"%{query.strip()}%"
        db_query = db_query.filter(
            ProductModel.name.ilike(search_term) |
            ProductModel.description.ilike(search_term) |
            ProductModel.category.ilike(search_term)
        )
    
    products = db_query.order_by(ProductModel.created_at.desc()).offset(skip).limit(limit).all()
    return products


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product


@router.post("", response_model=Product)
async def create_product(
    name: str = Form(...),
    description: str = Form(None),
    category: str = Form(None),
    price: int = Form(...),
    currency: str = Form("IRT"),
    stock: int = Form(0),
    is_active: bool = Form(True),
    image_url: str = Form(None),
    image_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    x_importer_key: str = Header(None),
    current_user: User = Depends(get_current_user, use_cache=False)
):
    """
    Create a new product. 
    Authentication can be via JWT token or X-Importer-Key header for bot imports.
    """
    # Check authentication - either valid JWT or valid importer token
    has_jwt_auth = current_user is not None
    has_importer_auth = x_importer_key and verify_importer_token(x_importer_key)
    
    if not has_jwt_auth and not has_importer_auth:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required"
        )
    
    # Handle image upload
    final_image_url = image_url
    if image_file:
        try:
            final_image_url = save_uploaded_file(image_file)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save image: {str(e)}"
            )
    
    # Generate unique slug
    base_slug = slugify(name, allow_unicode=True) if name else "product"
    slug = base_slug
    counter = 1
    while db.query(ProductModel).filter(ProductModel.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    # Create product
    product_data = {
        "name": name,
        "description": description,
        "category": category,
        "price": price,
        "currency": currency,
        "stock": stock,
        "is_active": is_active,
        "image_url": final_image_url,
        "slug": slug
    }
    
    product = ProductModel(**product_data)
    db.add(product)
    db.commit()
    db.refresh(product)
    
    return product


# Override the dependency for create_product to make auth optional
@router.post("", response_model=Product, dependencies=[])
async def create_product_override(*args, **kwargs):
    # Remove the current_user dependency and handle auth manually
    return await create_product(*args, **kwargs)


def get_current_user_optional(db: Session = Depends(get_db)):
    """Optional authentication - returns None if no valid token"""
    try:
        from ..auth import oauth2_scheme, get_current_user
        # This is a simplified version - in production, handle this more carefully
        return None
    except:
        return None


# Admin endpoints for product management
@router.get("/admin/stats")
def get_product_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get product statistics for admin dashboard"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    # Basic stats
    total_products = db.query(ProductModel).count()
    active_products = db.query(ProductModel).filter(ProductModel.is_active == True).count()
    out_of_stock = db.query(ProductModel).filter(ProductModel.stock <= 0).count()
    low_stock = db.query(ProductModel).filter(and_(ProductModel.stock > 0, ProductModel.stock <= 10)).count()
    
    # Category distribution
    categories = db.query(
        ProductModel.category,
        func.count(ProductModel.id).label('count')
    ).filter(ProductModel.category.isnot(None)).group_by(ProductModel.category).all()
    
    # Recent products
    recent_products = db.query(ProductModel).order_by(desc(ProductModel.created_at)).limit(5).all()
    
    return {
        "total_products": total_products,
        "active_products": active_products,
        "inactive_products": total_products - active_products,
        "out_of_stock": out_of_stock,
        "low_stock": low_stock,
        "categories": [{"name": cat[0], "count": cat[1]} for cat in categories],
        "recent_products": recent_products
    }


@router.get("/admin/search")
def admin_search_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status (active/inactive)"),
    stock_filter: Optional[str] = Query(None, description="Filter by stock (in_stock/out_of_stock/low_stock)"),
    sort_by: Optional[str] = Query("created_at", description="Sort by field"),
    sort_order: Optional[str] = Query("desc", description="Sort order (asc/desc)"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Advanced search and filtering for admin product management"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    query = db.query(ProductModel)
    
    # Apply filters
    if q:
        search_term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                ProductModel.name.ilike(search_term),
                ProductModel.description.ilike(search_term),
                ProductModel.category.ilike(search_term),
                ProductModel.slug.ilike(search_term)
            )
        )
    
    if category:
        query = query.filter(ProductModel.category == category)
    
    if status == "active":
        query = query.filter(ProductModel.is_active == True)
    elif status == "inactive":
        query = query.filter(ProductModel.is_active == False)
    
    if stock_filter == "out_of_stock":
        query = query.filter(ProductModel.stock <= 0)
    elif stock_filter == "low_stock":
        query = query.filter(and_(ProductModel.stock > 0, ProductModel.stock <= 10))
    elif stock_filter == "in_stock":
        query = query.filter(ProductModel.stock > 10)
    
    # Apply sorting
    sort_field = getattr(ProductModel, sort_by, ProductModel.created_at)
    if sort_order == "asc":
        query = query.order_by(asc(sort_field))
    else:
        query = query.order_by(desc(sort_field))
    
    # Get total count for pagination
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * per_page
    products = query.offset(offset).limit(per_page).all()
    
    return {
        "products": products,
        "pagination": {
            "page": page,
            "per_page": per_page,
            "total": total,
            "pages": (total + per_page - 1) // per_page
        }
    }


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    name: str = Form(...),
    description: str = Form(None),
    category: str = Form(None),
    price: int = Form(...),
    currency: str = Form("IRT"),
    stock: int = Form(0),
    is_active: bool = Form(True),
    image_url: str = Form(None),
    image_file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update an existing product"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Handle image upload if provided
    final_image_url = image_url or product.image_url
    if image_file:
        try:
            final_image_url = save_uploaded_file(image_file)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save image: {str(e)}"
            )
    
    # Update slug if name changed
    if name != product.name:
        base_slug = slugify(name, allow_unicode=True) if name else "product"
        slug = base_slug
        counter = 1
        while db.query(ProductModel).filter(
            and_(ProductModel.slug == slug, ProductModel.id != product_id)
        ).first():
            slug = f"{base_slug}-{counter}"
            counter += 1
        product.slug = slug
    
    # Update fields
    product.name = name
    product.description = description
    product.category = category
    product.price = price
    product.currency = currency
    product.stock = stock
    product.is_active = is_active
    product.image_url = final_image_url
    product.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(product)
    
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a product"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}


@router.post("/admin/bulk-update")
def bulk_update_products(
    product_ids: List[int] = Form(...),
    action: str = Form(...),  # activate, deactivate, delete, update_category
    category: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bulk operations on multiple products"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    products = db.query(ProductModel).filter(ProductModel.id.in_(product_ids)).all()
    
    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No products found"
        )
    
    updated_count = 0
    
    for product in products:
        if action == "activate":
            product.is_active = True
            updated_count += 1
        elif action == "deactivate":
            product.is_active = False
            updated_count += 1
        elif action == "update_category" and category:
            product.category = category
            updated_count += 1
        elif action == "delete":
            db.delete(product)
            updated_count += 1
        
        if action != "delete":
            product.updated_at = datetime.utcnow()
    
    db.commit()
    
    return {
        "message": f"Bulk {action} completed",
        "updated_count": updated_count
    }


@router.get("/admin/categories")
def get_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all unique categories with product counts"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    categories = db.query(
        ProductModel.category,
        func.count(ProductModel.id).label('product_count'),
        func.sum(ProductModel.stock).label('total_stock'),
        func.avg(ProductModel.price).label('avg_price')
    ).filter(ProductModel.category.isnot(None)).group_by(ProductModel.category).all()
    
    return [
        {
            "name": cat[0],
            "product_count": cat[1],
            "total_stock": cat[2] or 0,
            "avg_price": float(cat[3]) if cat[3] else 0
        }
        for cat in categories
    ]


@router.get("/admin/inventory-alerts")
def get_inventory_alerts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get products that need inventory attention"""
    if not current_user or current_user.role not in ['admin', 'super_admin']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    out_of_stock = db.query(ProductModel).filter(
        and_(ProductModel.stock <= 0, ProductModel.is_active == True)
    ).all()
    
    low_stock = db.query(ProductModel).filter(
        and_(ProductModel.stock > 0, ProductModel.stock <= 10, ProductModel.is_active == True)
    ).all()
    
    return {
        "out_of_stock": out_of_stock,
        "low_stock": low_stock,
        "alerts_count": len(out_of_stock) + len(low_stock)
    }
