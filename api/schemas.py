from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProductImageBase(BaseModel):
    url: str
    alt_text: Optional[str] = None

class ProductImageCreate(ProductImageBase):
    variant_id: Optional[int] = None
    product_id: Optional[int] = None

class ProductImage(ProductImageBase):
    id: int
    variant_id: Optional[int] = None
    product_id: Optional[int] = None

    class Config:
        from_attributes = True

class ProductVariantBase(BaseModel):
    color_name: str
    color_hex: Optional[str] = "#CCCCCC"
    price_override: Optional[float] = None

class ProductVariantCreate(ProductVariantBase):
    images: Optional[List[str]] = []

class ProductVariant(ProductVariantBase):
    id: int
    product_id: int
    images: List[ProductImage] = []

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: Optional[str] = None
    category: Optional[str] = "straight"
    category_label: Optional[str] = "Прямой диван"
    price: float = 0.0
    old_price: Optional[float] = None
    dimensions: Optional[str] = "210 × 95 × 84 см"
    sleeping_area: Optional[str] = "Не предусмотрено"
    seats: Optional[int] = 3
    availability: Optional[str] = "Под заказ · от 14 дней"
    badge: Optional[str] = "Новинка"
    description: Optional[str] = ""
    video: Optional[str] = None
    materials: Optional[str] = ""
    features: Optional[str] = ""

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    category_label: Optional[str] = None
    price: Optional[float] = None
    old_price: Optional[float] = None
    dimensions: Optional[str] = None
    sleeping_area: Optional[str] = None
    seats: Optional[int] = None
    availability: Optional[str] = None
    badge: Optional[str] = None
    description: Optional[str] = None
    video: Optional[str] = None
    materials: Optional[str] = None
    features: Optional[str] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    variants: List[ProductVariant] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AdminUserCreate(BaseModel):
    username: str
    password: str
