from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Any
from datetime import datetime


class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str
    role: str = "user"


class UserCreate(UserBase):
    password: str


class UserRegister(BaseModel):
    first_name: str
    last_name: str
    email_or_phone: str
    password: str
    username: str


class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class BannerBase(BaseModel):
    key: str
    title: Optional[str] = None
    image_url: str
    link_url: Optional[str] = None
    price: int
    currency: str = "IRT"
    active: bool = True
    position: int = 0


class BannerCreate(BannerBase):
    pass


class BannerUpdate(BaseModel):
    title: Optional[str] = None
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    price: Optional[int] = None
    currency: Optional[str] = None
    active: Optional[bool] = None


class Banner(BannerBase):
    id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    price: int
    currency: str = "IRT"
    image_url: Optional[str] = None
    stock: int = 0
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    currency: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None


class Product(ProductBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CartItemBase(BaseModel):
    product_id: int
    quantity: int


class CartItemCreate(CartItemBase):
    pass


class CartItemUpdate(BaseModel):
    quantity: int


class CartItem(CartItemBase):
    id: int
    user_id: int
    product_name: str
    product_price: int
    product_image_url: Optional[str] = None
    total_price: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class CartResponse(BaseModel):
    items: List[CartItem]
    total_quantity: int
    total_amount: int
    currency: str = "IRR"


class OrderItemBase(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    unit_price: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int
    total_price: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: Optional[str] = None
    shipping_address: str
    payment_method: str = "cash_on_delivery"
    customer_notes: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class Order(OrderBase):
    id: int
    order_number: str
    user_id: int
    subtotal: int
    shipping_cost: int = 150000
    tax_amount: int = 0
    total: int
    currency: str = "IRT"
    status: str = "registered"
    payment_status: str = "pending"
    payment_reference: Optional[str] = None
    shipping_company: Optional[str] = None
    tracking_number: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None
    items: List[OrderItem] = []
    
    class Config:
        from_attributes = True


class OrderUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
    payment_reference: Optional[str] = None
    shipping_company: Optional[str] = None
    tracking_number: Optional[str] = None
    admin_notes: Optional[str] = None
    shipped_at: Optional[datetime] = None
    delivered_at: Optional[datetime] = None


# Product Import Schemas
class ProductImport(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock_quantity: Optional[int] = 0
    sku: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True


class ImportResult(BaseModel):
    success: bool
    error: Optional[str] = None
    product_id: Optional[int] = None
    action: Optional[str] = None  # "created" or "updated"


class ImportResponse(BaseModel):
    import_id: str
    message: str
    status: str


class ImportStatus(BaseModel):
    import_id: str
    status: str
    progress: Optional[int] = None
    total: Optional[int] = None
    processed: Optional[int] = None
    success_count: Optional[int] = None
    error_count: Optional[int] = None
    errors: Optional[List[str]] = None
    created_at: datetime
