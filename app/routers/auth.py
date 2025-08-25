from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from ..database import get_db
from ..auth import authenticate_user, create_access_token, create_access_token_with_role, get_current_user, get_password_hash, require_admin, ACCESS_TOKEN_EXPIRE_MINUTES
from ..schemas import Token, User, UserRegister
from ..models import User as UserModel

router = APIRouter()


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    print(f"[AUTH] Login attempt for username: {form_data.username}")
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        print(f"[AUTH] Login failed for username: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    print(f"[AUTH] Login successful for user: {user.username} ({user.email}) - Role: {user.role}")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token_with_role(user, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=Token)
async def register_user(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    # Check if username or email already exists
    existing_user = db.query(UserModel).filter(
        (UserModel.username == user_data.username) | 
        (UserModel.email == user_data.email_or_phone)
    ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    db_user = UserModel(
        username=user_data.username,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        email=user_data.email_or_phone,
        password_hash=get_password_hash(user_data.password),
        role="user"  # Default role for new users
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Generate access token with role
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token_with_role(db_user, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/user", response_model=User)
async def read_users_me(current_user: UserModel = Depends(get_current_user)):
    return current_user

@router.get("/admin/test")
async def admin_only_test(current_user: UserModel = Depends(require_admin())):
    """Test endpoint that requires admin role"""
    return {
        "message": "Welcome to admin area!",
        "user": current_user.username,
        "role": current_user.role,
        "access_granted": True
    }
