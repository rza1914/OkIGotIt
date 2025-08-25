from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, desc, asc
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, date
import secrets

from ..database import get_db
from ..models import User, Order, OrderItem, OrderStatusHistory
from ..auth import get_current_user

router = APIRouter()

# Request Models
class OrderItemCreate(BaseModel):
    product_id: int
    product_name: str
    quantity: int = Field(gt=0)
    unit_price: int = Field(gt=0)

class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    payment_method: str
    customer_notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    tracking_number: Optional[str] = None
    shipping_company: Optional[str] = None

class OrderFilter(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    min_amount: Optional[int] = None
    max_amount: Optional[int] = None
    customer_name: Optional[str] = None
    order_number: Optional[str] = None

# Response Models
class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    unit_price: int
    total_price: int
    
    class Config:
        from_attributes = True

class OrderStatusHistoryResponse(BaseModel):
    id: int
    old_status: Optional[str]
    new_status: str
    notes: Optional[str]
    created_at: datetime
    changed_by_user_id: Optional[int]
    
    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    subtotal: int
    shipping_cost: int
    tax_amount: int
    total: int
    currency: str
    status: str
    payment_status: str
    payment_method: Optional[str]
    customer_name: str
    customer_email: str
    customer_phone: Optional[str]
    shipping_address: Optional[str]
    shipping_company: Optional[str]
    tracking_number: Optional[str]
    admin_notes: Optional[str]
    customer_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    shipped_at: Optional[datetime]
    delivered_at: Optional[datetime]
    items: List[OrderItemResponse] = []
    status_history: List[OrderStatusHistoryResponse] = []
    
    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    customer_email: str
    total: int
    status: str
    payment_status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class OrderAnalytics(BaseModel):
    total_orders: int
    total_revenue: int
    average_order_value: int
    status_distribution: Dict[str, int]
    payment_method_distribution: Dict[str, int]
    daily_stats: List[Dict[str, Any]]
    
class BulkOrderUpdate(BaseModel):
    order_ids: List[int]
    action: str
    status: Optional[str] = None
    notes: Optional[str] = None

def generate_order_number() -> str:
    """Generate a unique order number"""
    prefix = "ORD"
    year = datetime.now().year
    random_part = secrets.token_hex(3).upper()
    return f"{prefix}-{year}-{random_part}"

def calculate_order_totals(items: List[OrderItemCreate], shipping_cost: int = 0, tax_rate: float = 0.09) -> dict:
    """Calculate order totals"""
    subtotal = sum(item.unit_price * item.quantity for item in items)
    tax_amount = int(subtotal * tax_rate)
    total = subtotal + shipping_cost + tax_amount
    
    return {
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "tax_amount": tax_amount,
        "total": total
    }

@router.post("/", response_model=OrderResponse)
async def create_order(
    order_data: OrderCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new order"""
    try:
        # Calculate totals
        totals = calculate_order_totals(order_data.items, shipping_cost=150000)  # 150,000 IRT shipping
        
        # Generate unique order number
        order_number = generate_order_number()
        while db.query(Order).filter(Order.order_number == order_number).first():
            order_number = generate_order_number()
        
        # Create the order
        db_order = Order(
            order_number=order_number,
            user_id=current_user.id,
            subtotal=totals["subtotal"],
            shipping_cost=totals["shipping_cost"],
            tax_amount=totals["tax_amount"],
            total=totals["total"],
            status="registered",
            payment_status="pending",
            payment_method=order_data.payment_method,
            customer_name=order_data.customer_name,
            customer_email=order_data.customer_email,
            customer_phone=order_data.customer_phone,
            shipping_address=order_data.shipping_address,
            customer_notes=order_data.customer_notes
        )
        db.add(db_order)
        db.flush()
        
        # Create order items
        for item_data in order_data.items:
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item_data.product_id,
                product_name=item_data.product_name,
                quantity=item_data.quantity,
                unit_price=item_data.unit_price,
                total_price=item_data.unit_price * item_data.quantity
            )
            db.add(order_item)
        
        # Create initial status history
        status_history = OrderStatusHistory(
            order_id=db_order.id,
            old_status=None,
            new_status="registered",
            notes="سفارش ثبت شد",
            changed_by_user_id=current_user.id
        )
        db.add(status_history)
        
        db.commit()
        db.refresh(db_order)
        
        return db_order
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to create order: {str(e)}")

# Admin routes
@router.get("/admin", response_model=List[OrderListResponse])
async def get_all_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    payment_status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc")
):
    """Get all orders (admin only)"""
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    query = db.query(Order)
    
    # Apply filters
    if status:
        query = query.filter(Order.status == status)
    if payment_status:
        query = query.filter(Order.payment_status == payment_status)
    if search:
        query = query.filter(
            or_(
                Order.order_number.ilike(f"%{search}%"),
                Order.customer_name.ilike(f"%{search}%"),
                Order.customer_email.ilike(f"%{search}%")
            )
        )
    
    # Apply sorting
    sort_column = getattr(Order, sort_by, Order.created_at)
    if sort_order.lower() == "desc":
        query = query.order_by(desc(sort_column))
    else:
        query = query.order_by(asc(sort_column))
    
    # Apply pagination
    offset = (page - 1) * limit
    orders = query.offset(offset).limit(limit).all()
    
    return orders

@router.get("/admin/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get order by ID (admin only)"""
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.put("/admin/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status_update: OrderStatusUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update order status (admin only)"""
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    old_status = order.status
    
    # Update order
    order.status = status_update.status
    if status_update.tracking_number:
        order.tracking_number = status_update.tracking_number
    if status_update.shipping_company:
        order.shipping_company = status_update.shipping_company
    if status_update.notes:
        order.admin_notes = status_update.notes
    
    # Set timestamps based on status
    now = datetime.utcnow()
    if status_update.status == "shipped" and not order.shipped_at:
        order.shipped_at = now
    elif status_update.status == "delivered" and not order.delivered_at:
        order.delivered_at = now
    
    # Create status history entry
    status_history = OrderStatusHistory(
        order_id=order.id,
        old_status=old_status,
        new_status=status_update.status,
        notes=status_update.notes,
        changed_by_user_id=current_user.id
    )
    db.add(status_history)
    
    try:
        db.commit()
        db.refresh(order)
        return order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to update order: {str(e)}")

@router.post("/admin/bulk-update")
async def bulk_update_orders(
    bulk_update: BulkOrderUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bulk update orders (admin only)"""
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    orders = db.query(Order).filter(Order.id.in_(bulk_update.order_ids)).all()
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found")
    
    updated_orders = []
    
    try:
        for order in orders:
            old_status = order.status
            
            if bulk_update.action == "update_status" and bulk_update.status:
                order.status = bulk_update.status
                
                # Create status history
                status_history = OrderStatusHistory(
                    order_id=order.id,
                    old_status=old_status,
                    new_status=bulk_update.status,
                    notes=bulk_update.notes or f"Bulk update to {bulk_update.status}",
                    changed_by_user_id=current_user.id
                )
                db.add(status_history)
                
            elif bulk_update.action == "cancel":
                order.status = "cancelled"
                
                status_history = OrderStatusHistory(
                    order_id=order.id,
                    old_status=old_status,
                    new_status="cancelled",
                    notes=bulk_update.notes or "Bulk cancellation",
                    changed_by_user_id=current_user.id
                )
                db.add(status_history)
            
            updated_orders.append(order.id)
        
        db.commit()
        return {"message": f"Updated {len(updated_orders)} orders", "updated_orders": updated_orders}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Failed to bulk update orders: {str(e)}")

@router.get("/admin/analytics", response_model=OrderAnalytics)
async def get_order_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None)
):
    """Get order analytics (admin only)"""
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    query = db.query(Order)
    
    if date_from:
        query = query.filter(Order.created_at >= date_from)
    if date_to:
        query = query.filter(Order.created_at <= date_to)
    
    orders = query.all()
    
    # Calculate analytics
    total_orders = len(orders)
    total_revenue = sum(order.total for order in orders)
    average_order_value = total_revenue // total_orders if total_orders > 0 else 0
    
    # Status distribution
    status_distribution = {}
    for order in orders:
        status_distribution[order.status] = status_distribution.get(order.status, 0) + 1
    
    # Payment method distribution
    payment_method_distribution = {}
    for order in orders:
        if order.payment_method:
            payment_method_distribution[order.payment_method] = payment_method_distribution.get(order.payment_method, 0) + 1
    
    return OrderAnalytics(
        total_orders=total_orders,
        total_revenue=total_revenue,
        average_order_value=average_order_value,
        status_distribution=status_distribution,
        payment_method_distribution=payment_method_distribution,
        daily_stats=[]  # TODO: Implement daily stats
    )

# User routes (existing)
@router.get("/", response_model=List[OrderListResponse])
async def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all orders for the current user"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(Order.created_at.desc()).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def get_user_order(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific order for the current user"""
    order = db.query(Order).filter(
        and_(Order.id == order_id, Order.user_id == current_user.id)
    ).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order