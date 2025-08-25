"""
Admin user seeder for iShop
Creates default admin user with secure credentials
"""

import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash


def seed_admin_user():
    """Create default admin user"""
    print("Seeding admin user...")
    
    db: Session = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(
            (User.username == "admin") | 
            (User.email == "admin@ishop.com")
        ).first()
        
        if existing_admin:
            print(f"Admin user already exists: {existing_admin.username}")
            return existing_admin
        
        # Get admin password from environment or use default
        admin_password = os.getenv("ADMIN_PASSWORD", "Admin@123456")
        admin_email = os.getenv("ADMIN_EMAIL", "admin@ishop.com")
        
        # Create admin user
        admin_user = User(
            username="admin",
            first_name="ادمین",
            last_name="سیستم", 
            email=admin_email,
            password_hash=get_password_hash(admin_password),
            is_active=True,
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Admin user created successfully!")
        print(f"   Email: {admin_email}")
        print(f"   Username: admin")
        print(f"   Password: {admin_password}")
        print("   ⚠️  Remember to change the default password in production!")
        
        return admin_user
        
    except Exception as e:
        print(f"❌ Error creating admin user: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin_user()