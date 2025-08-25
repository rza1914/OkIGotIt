#!/usr/bin/env python3
"""
Admin User Creation Script for iShop
Creates or updates admin user with proper role and credentials
"""

import sys
import os
from sqlalchemy import text
from sqlalchemy.orm import Session

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import User
from app.auth import get_password_hash

def create_admin_user():
    """Create or update admin user with super_admin role"""
    
    print("Creating/updating admin user...")
    
    db: Session = SessionLocal()
    
    admin_credentials = {
        "username": "admin",
        "email": "admin@site.com", 
        "password": "Admin@123456",
        "first_name": "Super",
        "last_name": "Admin",
        "role": "super_admin"
    }
    
    try:
        # Check if admin user already exists (by username or email)
        existing_admin = db.query(User).filter(
            (User.username == admin_credentials["username"]) | 
            (User.email == admin_credentials["email"])
        ).first()
        
        if existing_admin:
            print(f"Admin user found: {existing_admin.username} ({existing_admin.email})")
            
            # Update existing admin user
            existing_admin.username = admin_credentials["username"]
            existing_admin.email = admin_credentials["email"]
            existing_admin.first_name = admin_credentials["first_name"]
            existing_admin.last_name = admin_credentials["last_name"]
            existing_admin.password_hash = get_password_hash(admin_credentials["password"])
            existing_admin.role = admin_credentials["role"]
            
            db.commit()
            print("Admin user updated successfully!")
            
        else:
            # Create new admin user
            print("Creating new admin user...")
            admin_user = User(
                username=admin_credentials["username"],
                email=admin_credentials["email"],
                first_name=admin_credentials["first_name"],
                last_name=admin_credentials["last_name"],
                password_hash=get_password_hash(admin_credentials["password"]),
                role=admin_credentials["role"]
            )
            
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print("New admin user created successfully!")
        
        # Verify admin user
        admin = db.query(User).filter(User.username == admin_credentials["username"]).first()
        if admin:
            print(f"ADMIN USER VERIFIED:")
            print(f"  ID: {admin.id}")
            print(f"  Username: {admin.username}")
            print(f"  Email: {admin.email}")
            print(f"  Name: {admin.first_name} {admin.last_name}")
            print(f"  Role: {admin.role}")
            print(f"  Password: {admin_credentials['password']}")
        
        return admin
        
    except Exception as e:
        print(f"Error creating/updating admin user: {e}")
        db.rollback()
        return None
    finally:
        db.close()

def update_existing_users_roles():
    """Update existing users to have default 'user' role"""
    print("Updating existing users with default role...")
    
    db: Session = SessionLocal()
    try:
        # Update all users without role or with null role to 'user'
        result = db.execute(text("""
            UPDATE users 
            SET role = 'user' 
            WHERE role IS NULL OR role = '' OR role = 'N/A'
        """))
        
        db.commit()
        print(f"Updated {result.rowcount} users with default 'user' role")
        
        # Show all users with their roles
        users = db.query(User).all()
        print("\nAll users with roles:")
        for user in users:
            print(f"  {user.username} ({user.email}) - Role: {user.role}")
            
    except Exception as e:
        print(f"Error updating user roles: {e}")
        db.rollback()
    finally:
        db.close()

def verify_admin_login():
    """Test admin login credentials"""
    print("\nTesting admin login...")
    
    from app.auth import authenticate_user
    
    db: Session = SessionLocal()
    try:
        # Test with username
        user1 = authenticate_user(db, "admin", "Admin@123456")
        print(f"Login with username: {'SUCCESS' if user1 else 'FAILED'}")
        
        # Test with email
        user2 = authenticate_user(db, "admin@site.com", "Admin@123456")
        print(f"Login with email: {'SUCCESS' if user2 else 'FAILED'}")
        
        if user1:
            print(f"Authenticated user: {user1.username} (Role: {user1.role})")
            
    except Exception as e:
        print(f"Error testing login: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("=== ADMIN USER CREATION SCRIPT ===")
    
    # Update existing users roles
    update_existing_users_roles()
    
    # Create/update admin user
    admin = create_admin_user()
    
    if admin:
        # Test login
        verify_admin_login()
        
        print("\n" + "="*50)
        print("ADMIN CREDENTIALS:")
        print("Username: admin")
        print("Email: admin@site.com")
        print("Password: Admin@123456")
        print("Role: super_admin")
        print("="*50)
    else:
        print("Failed to create admin user!")