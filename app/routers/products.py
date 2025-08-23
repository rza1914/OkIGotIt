import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Form, Header
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
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
