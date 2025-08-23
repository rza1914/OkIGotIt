from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    username: str
    first_name: str
    last_name: str
    email: str


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
