from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from api.database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=True)
    name = Column(String, index=True)
    category = Column(String, default="straight")
    category_label = Column(String, default="Прямой диван")
    price = Column(Float, default=0.0)
    old_price = Column(Float, nullable=True)
    dimensions = Column(String, default="210 × 95 × 84 см")
    sleeping_area = Column(String, nullable=True)
    seats = Column(Integer, default=3)
    availability = Column(String, default="Под заказ · от 14 дней")
    badge = Column(String, default="Новинка")
    description = Column(Text, nullable=True)
    video = Column(String, nullable=True)
    materials = Column(Text, nullable=True) # JSON or comma-separated
    features = Column(Text, nullable=True)  # JSON or comma-separated
    created_at = Column(DateTime, default=datetime.utcnow)
    
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    color_name = Column(String)
    color_hex = Column(String, default="#CCCCCC")
    price_override = Column(Float, nullable=True)
    
    product = relationship("Product", back_populates="variants")
    images = relationship("ProductImage", back_populates="variant", cascade="all, delete-orphan")


class ProductImage(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey("product_variants.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    url = Column(Text)
    alt_text = Column(String, nullable=True)

    variant = relationship("ProductVariant", back_populates="images")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
