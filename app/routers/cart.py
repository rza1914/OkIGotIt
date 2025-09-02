from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List

from ..database import get_db
from ..auth import get_current_user
from ..models import User, CartItem as CartItemModel, Product as ProductModel
from ..schemas import CartItemCreate, CartItemUpdate, CartItem, CartResponse

router = APIRouter(
    prefix="/api/v1/cart",
    tags=["cart"]
)


@router.get("", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's cart items"""
    cart_items = db.query(CartItemModel).filter(
        CartItemModel.user_id == current_user.id
    ).all()
    
    # Calculate cart totals
    total_quantity = sum(item.quantity for item in cart_items)
    
    # Build response with product details
    cart_response_items = []
    total_amount = 0
    
    for cart_item in cart_items:
        product = cart_item.product
        item_total = product.price * cart_item.quantity
        total_amount += item_total
        
        cart_response_items.append(CartItem(
            id=cart_item.id,
            user_id=cart_item.user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity,
            product_name=product.name,
            product_price=product.price,
            product_image_url=product.image_url,
            total_price=item_total,
            created_at=cart_item.created_at,
            updated_at=cart_item.updated_at
        ))
    
    return CartResponse(
        items=cart_response_items,
        total_quantity=total_quantity,
        total_amount=total_amount,
        currency="IRR"
    )


@router.post("/add", response_model=CartItem)
async def add_to_cart(
    cart_item_data: CartItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add item to cart or update quantity if already exists"""
    
    # Check if product exists
    product = db.query(ProductModel).filter(ProductModel.id == cart_item_data.product_id).first()
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product is not available"
        )
    
    if cart_item_data.quantity > product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Available: {product.stock}"
        )
    
    # Check if item already in cart
    existing_cart_item = db.query(CartItemModel).filter(
        and_(
            CartItemModel.user_id == current_user.id,
            CartItemModel.product_id == cart_item_data.product_id
        )
    ).first()
    
    if existing_cart_item:
        # Update existing item quantity
        new_quantity = existing_cart_item.quantity + cart_item_data.quantity
        if new_quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Total quantity would exceed stock. Available: {product.stock}"
            )
        existing_cart_item.quantity = new_quantity
        db.commit()
        db.refresh(existing_cart_item)
        cart_item = existing_cart_item
    else:
        # Create new cart item
        cart_item = CartItemModel(
            user_id=current_user.id,
            product_id=cart_item_data.product_id,
            quantity=cart_item_data.quantity
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
    
    # Return response with product details
    item_total = product.price * cart_item.quantity
    return CartItem(
        id=cart_item.id,
        user_id=cart_item.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        product_name=product.name,
        product_price=product.price,
        product_image_url=product.image_url,
        total_price=item_total,
        created_at=cart_item.created_at,
        updated_at=cart_item.updated_at
    )


@router.put("/update/{item_id}", response_model=CartItem)
async def update_cart_item(
    item_id: int,
    update_data: CartItemUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update cart item quantity"""
    
    cart_item = db.query(CartItemModel).filter(
        and_(
            CartItemModel.id == item_id,
            CartItemModel.user_id == current_user.id
        )
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    product = cart_item.product
    if update_data.quantity > product.stock:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient stock. Available: {product.stock}"
        )
    
    if update_data.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Quantity must be greater than 0"
        )
    
    cart_item.quantity = update_data.quantity
    db.commit()
    db.refresh(cart_item)
    
    # Return response with product details
    item_total = product.price * cart_item.quantity
    return CartItem(
        id=cart_item.id,
        user_id=cart_item.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        product_name=product.name,
        product_price=product.price,
        product_image_url=product.image_url,
        total_price=item_total,
        created_at=cart_item.created_at,
        updated_at=cart_item.updated_at
    )


@router.delete("/remove/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove item from cart"""
    
    cart_item = db.query(CartItemModel).filter(
        and_(
            CartItemModel.id == item_id,
            CartItemModel.user_id == current_user.id
        )
    ).first()
    
    if not cart_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found"
        )
    
    db.delete(cart_item)
    db.commit()
    
    return {"message": "Item removed from cart successfully"}


@router.delete("/clear")
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Clear all items from user's cart"""
    
    db.query(CartItemModel).filter(
        CartItemModel.user_id == current_user.id
    ).delete()
    db.commit()
    
    return {"message": "Cart cleared successfully"}


@router.get("/count")
async def get_cart_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get total number of items in cart"""
    
    from sqlalchemy import func
    total_quantity = db.query(func.sum(CartItemModel.quantity)).filter(
        CartItemModel.user_id == current_user.id
    ).scalar() or 0
    
    return {"count": int(total_quantity)}