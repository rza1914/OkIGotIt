from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import get_current_user
from ..models import Banner as BannerModel, User
from ..schemas import Banner, BannerUpdate

router = APIRouter()


@router.get("", response_model=List[Banner])
def get_banners(db: Session = Depends(get_db)):
    banners = db.query(BannerModel).order_by(BannerModel.position).all()
    return banners


@router.get("/{key}", response_model=Banner)
def get_banner(key: str, db: Session = Depends(get_db)):
    banner = db.query(BannerModel).filter(BannerModel.key == key).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )
    return banner


@router.put("/{key}", response_model=Banner)
def update_banner(
    key: str,
    banner_update: BannerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    banner = db.query(BannerModel).filter(BannerModel.key == key).first()
    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Banner not found"
        )
    
    # Update banner fields
    update_data = banner_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(banner, field, value)
    
    db.commit()
    db.refresh(banner)
    return banner
