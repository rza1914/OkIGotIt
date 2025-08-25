#!/usr/bin/env python3
"""
Database Schema Checker for iShop
Checks current schema and identifies missing columns
"""

import sys
import os
from sqlalchemy import text, inspect
from sqlalchemy.orm import Session

# Add the parent directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, SessionLocal
from app.models import User

def check_database_schema():
    """Check current database schema"""
    print("Checking database schema...")
    
    # Get database inspector
    inspector = inspect(engine)
    
    # Check if users table exists
    if not inspector.has_table('users'):
        print("ERROR: Users table does not exist!")
        return False
    
    # Get table columns
    columns = inspector.get_columns('users')
    column_names = [col['name'] for col in columns]
    
    print(f"Users table columns: {column_names}")
    
    # Check for role column
    has_role = 'role' in column_names
    print(f"Role column exists: {has_role}")
    
    if not has_role:
        print("WARNING: Role column is missing from users table")
        return False
    
    return True

def get_users_info():
    """Get information about existing users"""
    print("Getting users information...")
    
    db: Session = SessionLocal()
    try:
        # Get all users
        users = db.query(User).all()
        print(f"Total users: {len(users)}")
        
        for user in users:
            role = getattr(user, 'role', 'N/A')
            print(f"User: {user.username} ({user.email}) - Role: {role}")
            
    except Exception as e:
        print(f"Error getting users: {e}")
    finally:
        db.close()

def add_role_column():
    """Add role column to users table if missing"""
    print("Adding role column to users table...")
    
    db: Session = SessionLocal()
    try:
        # Add role column with default value
        db.execute(text("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'"))
        db.commit()
        print("Role column added successfully!")
        return True
        
    except Exception as e:
        print(f"Error adding role column: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("=== DATABASE SCHEMA CHECKER ===")
    
    # Check schema
    schema_ok = check_database_schema()
    
    # If role column missing, add it
    if not schema_ok:
        if add_role_column():
            print("Role column added. Rechecking schema...")
            check_database_schema()
    
    # Get users info
    get_users_info()