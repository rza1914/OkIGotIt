#!/usr/bin/env python3
"""
Database initialization script for iShop
Creates tables and default admin user
"""

import sys
import os
from sqlalchemy.orm import Session
from sqlalchemy import text

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal
from app.models import Base, User
from app.auth import get_password_hash

def init_database():
    """Initialize database with tables and default data"""
    
    print("Initializing iShop database...")
    
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully")
    
    # Create database session
    db: Session = SessionLocal()
    
    try:
        # Check if admin user already exists
        existing_admin = db.query(User).filter(
            (User.username == "admin") | (User.email == "admin@site.com")
        ).first()
        
        if existing_admin:
            print(f"Admin user already exists: {existing_admin.username} ({existing_admin.email})")
            print("Database initialization complete")
            return
        
        # Create default admin user
        print("Creating default admin user...")
        admin_user = User(
            username="admin",
            first_name="ادمین",
            last_name="سیستم",
            email="admin@site.com",
            password_hash=get_password_hash("Admin@123456")
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("Default admin user created successfully!")
        print("Email: admin@site.com")
        print("Password: Admin@123456")
        print("Username: admin")
        
        # Check total users count
        total_users = db.query(User).count()
        print(f"Total users in database: {total_users}")
        
        print("Database initialization complete")
        
    except Exception as e:
        print(f"Error during database initialization: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()

def check_database_status():
    """Check current database status"""
    print("Checking database status...")
    
    db: Session = SessionLocal()
    try:
        # Check if tables exist
        result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = [row[0] for row in result.fetchall()]
        print(f"Tables found: {', '.join(tables)}")
        
        # Count users
        if 'users' in tables:
            user_count = db.query(User).count()
            print(f"Total users: {user_count}")
            
            # List first few users
            users = db.query(User).limit(5).all()
            if users:
                print("Users in database:")
                for user in users:
                    print(f"  - {user.username} ({user.email}) - {user.first_name} {user.last_name}")
            else:
                print("No users found in database")
        else:
            print("Users table not found")
            
    except Exception as e:
        print(f"Error checking database: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "check":
        check_database_status()
    else:
        init_database()