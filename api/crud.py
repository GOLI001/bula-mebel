from sqlalchemy.orm import Session
from api import models, schemas
from api.auth import get_password_hash
import json

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    product_data = product.dict(exclude={"variants"})
    db_product = models.Product(**product_data)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    # If variants provided
    if product.variants:
        for v in product.variants:
            variant_data = v.dict(exclude={"images"})
            db_variant = models.ProductVariant(**variant_data, product_id=db_product.id)
            db.add(db_variant)
            db.commit()
            db.refresh(db_variant)
            
            if v.images:
                for img_url in v.images:
                    db_img = models.ProductImage(variant_id=db_variant.id, product_id=db_product.id, url=img_url)
                    db.add(db_img)
                db.commit()

    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: schemas.ProductUpdate):
    db_product = get_product(db, product_id)
    if not db_product:
        return None
    
    update_data = product_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if not db_product:
        return False
    db.delete(db_product)
    db.commit()
    return True

def create_product_variant(db: Session, variant: schemas.ProductVariantCreate, product_id: int):
    variant_data = variant.dict(exclude={"images"})
    db_variant = models.ProductVariant(**variant_data, product_id=product_id)
    db.add(db_variant)
    db.commit()
    db.refresh(db_variant)

    if variant.images:
        for img_url in variant.images:
            db_img = models.ProductImage(variant_id=db_variant.id, product_id=product_id, url=img_url)
            db.add(db_img)
        db.commit()

    db.refresh(db_variant)
    return db_variant

def delete_product_variant(db: Session, variant_id: int):
    db_variant = db.query(models.ProductVariant).filter(models.ProductVariant.id == variant_id).first()
    if not db_variant:
        return False
    db.delete(db_variant)
    db.commit()
    return True

def create_product_image(db: Session, image: schemas.ProductImageCreate, variant_id: int):
    db_image = models.ProductImage(
        variant_id=variant_id,
        product_id=image.product_id,
        url=image.url,
        alt_text=image.alt_text
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def delete_product_image(db: Session, image_id: int):
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if not db_image:
        return False
    db.delete(db_image)
    db.commit()
    return True

def get_admin_user(db: Session, username: str):
    return db.query(models.AdminUser).filter(models.AdminUser.username == username).first()

def create_admin_user(db: Session, user: schemas.AdminUserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.AdminUser(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_admin_credentials(db: Session, user: models.AdminUser, new_username: str = None, new_password: str = None):
    import os
    if new_username and new_username.strip():
        user.username = new_username.strip()
    if new_password and new_password.strip():
        user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    return user

def seed_default_data_if_empty(db: Session):
    import os
    default_user = os.environ.get("ADMIN_USERNAME", "admin")
    default_pass = os.environ.get("ADMIN_PASSWORD", "adminpassword123")
    admin = get_admin_user(db, default_user)
    if not admin:
        create_admin_user(db, schemas.AdminUserCreate(username=default_user, password=default_pass))
    
    # Check if products exist
    count = db.query(models.Product).count()
    if count == 0:
        # Seed initial sofas with colors and realistic photo links
        initial_sofas = [
            {
                "name": "Orda",
                "slug": "orda-260",
                "category": "corner",
                "category_label": "Угловой диван",
                "price": 310000.0,
                "old_price": 345000.0,
                "dimensions": "260 × 165 × 82 см",
                "sleeping_area": "200 × 145 см",
                "seats": 4,
                "availability": "Под заказ · от 14 дней",
                "badge": "Хит продаж",
                "description": "Просторная модель для семейной гостиной. Лаконичный силуэт, мягкая посадка и удобная угловая секция.",
                "video": "/media/video/orda.mp4",
                "variants": [
                    {
                        "color_name": "Молочный",
                        "color_hex": "#F3ECE2",
                        "price_override": None,
                        "images": ["/media/products/orda-1.webp", "/media/products/orda-2.webp"]
                    },
                    {
                        "color_name": "Светло-серый",
                        "color_hex": "#C4C4C2",
                        "price_override": None,
                        "images": ["/media/products/orda-2.webp", "/media/products/orda-3.webp"]
                    },
                    {
                        "color_name": "Графит",
                        "color_hex": "#3D3D3D",
                        "price_override": 320000.0,
                        "images": ["/media/products/orda-3.webp", "/media/products/orda-1.webp"]
                    }
                ]
            },
            {
                "name": "Terra",
                "slug": "terra-210",
                "category": "straight",
                "category_label": "Прямой диван",
                "price": 245000.0,
                "old_price": 275000.0,
                "dimensions": "210 × 95 × 84 см",
                "sleeping_area": "Не предусмотрено",
                "seats": 3,
                "availability": "Под заказ · от 12 дней",
                "badge": "Компактный",
                "description": "Лёгкий и аккуратный диван для современного интерьера. Сохраняет полноценную трёхместную посадку.",
                "video": "/media/video/terra.mp4",
                "variants": [
                    {
                        "color_name": "Молочный",
                        "color_hex": "#EFEBE4",
                        "price_override": None,
                        "images": ["/media/products/terra-1.webp", "/media/products/terra-2.webp"]
                    },
                    {
                        "color_name": "Бежевый",
                        "color_hex": "#D1B89D",
                        "price_override": None,
                        "images": ["/media/products/terra-2.webp", "/media/products/terra-3.webp"]
                    },
                    {
                        "color_name": "Серый",
                        "color_hex": "#8E9094",
                        "price_override": None,
                        "images": ["/media/products/terra-3.webp", "/media/products/terra-1.webp"]
                    }
                ]
            },
            {
                "name": "Loft",
                "slug": "loft-300",
                "category": "modular",
                "category_label": "Модульный диван",
                "price": 420000.0,
                "old_price": 468000.0,
                "dimensions": "300 × 175 × 80 см",
                "sleeping_area": "240 × 150 см",
                "seats": 5,
                "availability": "Под заказ · от 18 дней",
                "badge": "Выбор дизайнеров",
                "description": "Масштабная модульная модель с расслабленной посадкой. Конфигурацию Loft можно адаптировать под планировку.",
                "video": "/media/video/loft.mp4",
                "variants": [
                    {
                        "color_name": "Светло-серый",
                        "color_hex": "#BDBDBD",
                        "price_override": None,
                        "images": ["/media/products/loft-1.webp", "/media/products/loft-2.webp"]
                    },
                    {
                        "color_name": "Кремовый",
                        "color_hex": "#F4EBD9",
                        "price_override": None,
                        "images": ["/media/products/loft-2.webp", "/media/products/loft-3.webp"]
                    },
                    {
                        "color_name": "Тёмно-серый",
                        "color_hex": "#4A4D52",
                        "price_override": None,
                        "images": ["/media/products/loft-3.webp", "/media/products/loft-1.webp"]
                    }
                ]
            },
            {
                "name": "Oscar",
                "slug": "oscar-300",
                "category": "designer",
                "category_label": "Дизайнерский диван",
                "price": 465000.0,
                "old_price": 510000.0,
                "dimensions": "300 × 120 × 76 см",
                "sleeping_area": "Не предусмотрено",
                "seats": 5,
                "availability": "Под заказ · от 20 дней",
                "badge": "Новинка",
                "description": "Акцентная модель с плавной архитектурной формой. Одинаково эффектно смотрится у стены и в центре комнаты.",
                "video": "/media/video/oscar.mp4",
                "variants": [
                    {
                        "color_name": "Молочный букле",
                        "color_hex": "#FAF6EE",
                        "price_override": None,
                        "images": ["/media/products/oscar-1.webp", "/media/products/oscar-2.webp"]
                    },
                    {
                        "color_name": "Карамельный",
                        "color_hex": "#BA7C48",
                        "price_override": None,
                        "images": ["/media/products/oscar-2.webp", "/media/products/oscar-3.webp"]
                    },
                    {
                        "color_name": "Песочный",
                        "color_hex": "#D8C5A8",
                        "price_override": None,
                        "images": ["/media/products/oscar-3.webp", "/media/products/oscar-1.webp"]
                    }
                ]
            }
        ]

        for s in initial_sofas:
            create_product(db, schemas.ProductCreate(**s))

    # Also seed parsed tables and chairs from paradise-mebel if they don't exist yet
    has_tables_or_chairs = db.query(models.Product).filter(models.Product.category.in_(["tables", "chairs"])).first()
    if not has_tables_or_chairs:
        json_paths = [
            os.path.join(os.path.dirname(__file__), "parsed_paradise_products.json"),
            os.path.join(os.path.dirname(__file__), "..", "parsed_paradise_products.json"),
            "parsed_paradise_products.json",
        ]
        for p in json_paths:
            if os.path.exists(p):
                try:
                    with open(p, "r", encoding="utf-8") as f:
                        items = json.load(f)
                    for item in items:
                        item_data = {k: v for k, v in item.items() if k != "images"}
                        create_product(db, schemas.ProductCreate(**item_data))
                    break
                except Exception as e:
                    print(f"Error seeding paradise products: {e}")

