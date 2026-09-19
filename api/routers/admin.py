from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from api import crud, models, schemas, auth, database
from datetime import timedelta
import os
import base64
import uuid

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/admin/token")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except auth.JWTError:
        raise credentials_exception
    user = crud.get_admin_user(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@router.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    crud.seed_default_data_if_empty(db)
    user = crud.get_admin_user(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_admin_info(current_user: models.AdminUser = Depends(get_current_user)):
    return {"username": current_user.username, "id": current_user.id}

class ChangeCredentialsRequest(schemas.BaseModel):
    current_password: str
    new_username: schemas.Optional[str] = None
    new_password: schemas.Optional[str] = None

@router.post("/change-credentials")
def change_credentials(
    req: ChangeCredentialsRequest,
    db: Session = Depends(get_db),
    current_user: models.AdminUser = Depends(get_current_user)
):
    if not auth.verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Текущий пароль указан неверно"
        )
    if req.new_username and req.new_username != current_user.username:
        existing = crud.get_admin_user(db, req.new_username)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Пользователь с таким логином уже существует"
            )
    
    updated = crud.update_admin_credentials(
        db=db, 
        user=current_user, 
        new_username=req.new_username, 
        new_password=req.new_password
    )
    
    # Generate new token
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_token = auth.create_access_token(
        data={"sub": updated.username}, expires_delta=access_token_expires
    )
    return {
        "success": True, 
        "message": "Данные для входа успешно обновлены!", 
        "username": updated.username, 
        "access_token": new_token
    }

@router.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)):
    return crud.create_product(db=db, product=product)

@router.put("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product_update: schemas.ProductUpdate, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)):
    updated = crud.update_product(db=db, product_id=product_id, product_update=product_update)
    if not updated:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return updated

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)):
    success = crud.delete_product(db=db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Товар не найден")
    return {"success": True, "message": "Товар успешно удален"}

@router.post("/products/{product_id}/variants/", response_model=schemas.ProductVariant)
def create_variant_for_product(
    product_id: int, variant: schemas.ProductVariantCreate, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)
):
    return crud.create_product_variant(db=db, variant=variant, product_id=product_id)

@router.delete("/variants/{variant_id}")
def delete_variant(variant_id: int, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)):
    success = crud.delete_product_variant(db=db, variant_id=variant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Вариант цвета не найден")
    return {"success": True, "message": "Цвет успешно удален"}

@router.post("/variants/{variant_id}/images/", response_model=schemas.ProductImage)
def create_image_for_variant(
    variant_id: int, image: schemas.ProductImageCreate, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)
):
    return crud.create_product_image(db=db, image=image, variant_id=variant_id)

@router.delete("/images/{image_id}")
def delete_image(image_id: int, db: Session = Depends(get_db), current_user: models.AdminUser = Depends(get_current_user)):
    success = crud.delete_product_image(db=db, image_id=image_id)
    if not success:
        raise HTTPException(status_code=404, detail="Изображение не найдено")
    return {"success": True, "message": "Изображение удалено"}

@router.post("/seed")
def seed_database(db: Session = Depends(get_db)):
    crud.seed_default_data_if_empty(db)
    return {"status": "ok", "message": "Database checked/seeded"}
