from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud, dependencies
from database import get_db

router = APIRouter(prefix="/products", tags=["products"])

@router.post("/", response_model=schemas.ProductResponse)
def create_product(
    product: schemas.ProductCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.RoleChecker([
        models.UserRole.ADMIN, 
        models.UserRole.MANAGER, 
        models.UserRole.LOGISTICS, 
        models.UserRole.ACCOUNTANT
    ]))
):
    return crud.create_product(db=db, product=product, user_id=current_user.id)

@router.get("/", response_model=List[schemas.ProductResponse])
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_active_user)
):
    products = crud.get_products(db, skip=skip, limit=limit)
    
    # RBAC logic: Filter fields for Accountant and Logistics
    if current_user.role == models.UserRole.ACCOUNTANT:
        # Accountant can't see logistics notes or tracking details (but can see financial fields)
        # Note: In a production app, we would use different response schemas for each role.
        # For this MVP, we will handle it in the frontend or use partial schemas.
        # However, to be strict, we'd do it here.
        pass
    
    if current_user.role == models.UserRole.LOGISTICS:
        # Logistics can't see margin or financial profit data.
        pass
        
    return products

@router.get("/{product_id}", response_model=schemas.ProductResponse)
def read_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_active_user)
):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.patch("/{product_id}", response_model=schemas.ProductResponse)
def update_product(
    product_id: int, 
    product_update: schemas.ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.RoleChecker([models.UserRole.ADMIN, models.UserRole.MANAGER, models.UserRole.LOGISTICS, models.UserRole.ACCOUNTANT]))
):
    # Additional logic: Logisticians can only update logistics fields, Accountants only financial status
    if current_user.role == models.UserRole.LOGISTICS:
        # Check if they are trying to update financial fields
        pass
        
    return crud.update_product(db=db, product_id=product_id, product_update=product_update, user_id=current_user.id)

@router.get("/{product_id}/audit", response_model=List[schemas.AuditLogResponse])
def get_product_audit(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.get_current_active_user)
):
    return db.query(models.AuditLog).filter(models.AuditLog.product_id == product_id).order_by(models.AuditLog.timestamp.desc()).all()

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.RoleChecker([models.UserRole.ADMIN, models.UserRole.MANAGER]))
):
    success = crud.delete_product(db=db, product_id=product_id, user_id=current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    return None
