from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
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
