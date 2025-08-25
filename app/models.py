from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="user")  # user, admin, super_admin
    
    # Additional user fields for Persian orders
    phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    national_id = Column(String(20), nullable=True)
    
    # Relationships
    orders = relationship("Order", back_populates="user")
    status_changes = relationship("OrderStatusHistory", back_populates="changed_by", foreign_keys="OrderStatusHistory.changed_by_user_id")


class Banner(Base):
    __tablename__ = "banners"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(20), unique=True, index=True, nullable=False)  # hero, small1, small2, small3, small4
    title = Column(String(200), nullable=True)
    image_url = Column(Text, nullable=False)
    link_url = Column(Text, nullable=True)
    price = Column(Integer, nullable=False, default=0)  # Price in smallest currency unit
    currency = Column(String(10), nullable=False, default="IRT")
    active = Column(Boolean, nullable=False, default=True)
    position = Column(Integer, nullable=False, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, index=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True, index=True)
    price = Column(Integer, nullable=False, default=0)  # Price in smallest currency unit
    currency = Column(String(10), nullable=False, default="IRT")
    image_url = Column(Text, nullable=True)
    slug = Column(String(250), nullable=False, unique=True, index=True)
    stock = Column(Integer, nullable=False, default=0)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(20), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Order amounts
    subtotal = Column(Integer, nullable=False, default=0)
    shipping_cost = Column(Integer, nullable=False, default=0)
    tax_amount = Column(Integer, nullable=False, default=0)
    total = Column(Integer, nullable=False, default=0)
    currency = Column(String(10), nullable=False, default="IRT")
    
    # Order status
    status = Column(String(50), nullable=False, default="registered")  # registered, confirmed, preparing, shipped, delivered, cancelled, returned
    
    # Payment information
    payment_status = Column(String(50), nullable=False, default="pending")  # pending, paid, failed, refunded
    payment_method = Column(String(100), nullable=True)
    payment_reference = Column(String(100), nullable=True)
    
    # Shipping information
    shipping_address = Column(Text, nullable=True)
    shipping_company = Column(String(100), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    
    # Customer information
    customer_name = Column(String(200), nullable=False)
    customer_email = Column(String(255), nullable=False)
    customer_phone = Column(String(20), nullable=True)
    
    # Notes and comments
    admin_notes = Column(Text, nullable=True)
    customer_notes = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    shipped_at = Column(DateTime(timezone=True), nullable=True)
    delivered_at = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    status_history = relationship("OrderStatusHistory", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    product_name = Column(String(200), nullable=False)  # Store name at time of order
    quantity = Column(Integer, nullable=False, default=1)
    unit_price = Column(Integer, nullable=False)  # Price per unit at time of order
    total_price = Column(Integer, nullable=False)  # quantity * unit_price
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    old_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    changed_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    order = relationship("Order", back_populates="status_history")
    changed_by = relationship("User")
