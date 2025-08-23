from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from ..database import get_db
from ..models import User, Order, OrderItem
from ..auth import get_current_user

router = APIRouter()

class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price: int

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    total: int

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total: int
    status: str
    
    class Config:
        from_attributes = True

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order for the current user"""
    try:
        # Create the order
        db_order = Order(
            user_id=current_user.id,
            total=order_data.total,
            status="created"
        )
        db.add(db_order)
        db.flush()  # To get the order ID
        
        # Create order items
        for item_data in order_data.items:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data.product_id,
                quantity=item_data.quantity,
                price=item_data.price
            )
            db.add(order_item)
        
        db.commit()
        db.refresh(db_order)
        
        return db_order
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create order: {str(e)}")

@router.get("/", response_model=List[OrderResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders for the current user"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders