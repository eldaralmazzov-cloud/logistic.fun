from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas, dependencies, crud
from database import get_db

router = APIRouter(prefix="/settings", tags=["settings"])

@router.get("/", response_model=List[schemas.GlobalSettingsResponse])
def get_settings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.RoleChecker([models.UserRole.ADMIN]))
):
    return db.query(models.GlobalSettings).all()

@router.post("/", response_model=schemas.GlobalSettingsResponse)
def update_setting(
    setting: schemas.GlobalSettingsBase,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.RoleChecker([models.UserRole.ADMIN]))
):
    db_setting = db.query(models.GlobalSettings).filter(models.GlobalSettings.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
        db_setting.description = setting.description
    else:
        db_setting = models.GlobalSettings(**setting.dict())
        db.add(db_setting)
    
    db.commit()
    db.refresh(db_setting)
    return db_setting

@router.get("/audit", response_model=List[schemas.AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(dependencies.RoleChecker([models.UserRole.ADMIN]))
):
    return crud.get_audit_logs(db)
