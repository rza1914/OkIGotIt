#!/usr/bin/env python3
"""
Database Management Script for iShop
Handles database initialization, migrations, seeding, and management tasks
"""

import sys
import os
import argparse
from pathlib import Path
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect

# Add the project root to the path
project_root = Path(__file__).parent
sys.path.append(str(project_root))

from app.database import engine, SessionLocal
from app.models import Base, User, Product, Category, Banner
from app.database.seeders.admin_user import seed_admin_user
from app.database.seeders.sample_products import run_all_seeders


class DatabaseManager:
    """Database management utility class"""
    
    def __init__(self):
        self.engine = engine
        self.db_path = project_root / "ishop.db"
    
    def init_database(self, with_sample_data=False):
        """Initialize database with tables and optional sample data"""
        print("🚀 Initializing iShop database...")
        
        try:
            # Create all tables
            print("📋 Creating database tables...")
            Base.metadata.create_all(bind=self.engine)
            
            # Run initial migration if exists
            migration_path = project_root / "app" / "database" / "migrations" / "001_initial_schema.py"
            if migration_path.exists():
                print("🔄 Running initial migration...")
                from app.database.migrations.initial_schema import upgrade
                upgrade()
            
            print("✅ Database tables created successfully")
            
            # Create admin user
            print("👤 Creating admin user...")
            seed_admin_user()
            
            # Optionally add sample data
            if with_sample_data:
                print("🌱 Adding sample data...")
                run_all_seeders()
            
            print("🎉 Database initialization completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error initializing database: {str(e)}")
            return False
    
    def reset_database(self, confirm=False):
        """Reset database by dropping all tables and recreating"""
        if not confirm:
            response = input("⚠️  This will delete ALL data! Are you sure? (yes/no): ")
            if response.lower() != 'yes':
                print("Database reset cancelled")
                return False
        
        print("🗑️  Resetting database...")
        
        try:
            # Drop all tables
            Base.metadata.drop_all(bind=self.engine)
            print("🧹 All tables dropped")
            
            # Recreate database
            return self.init_database(with_sample_data=True)
            
        except Exception as e:
            print(f"❌ Error resetting database: {str(e)}")
            return False
    
    def backup_database(self, backup_path=None):
        """Create a backup of the database"""
        if not backup_path:
            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            backup_path = project_root / f"backups" / f"ishop_backup_{timestamp}.db"
        
        # Create backups directory if it doesn't exist
        backup_path.parent.mkdir(exist_ok=True)
        
        try:
            import shutil
            shutil.copy2(self.db_path, backup_path)
            print(f"✅ Database backed up to: {backup_path}")
            return str(backup_path)
            
        except Exception as e:
            print(f"❌ Error backing up database: {str(e)}")
            return None
    
    def restore_database(self, backup_path):
        """Restore database from backup"""
        if not Path(backup_path).exists():
            print(f"❌ Backup file not found: {backup_path}")
            return False
        
        try:
            import shutil
            shutil.copy2(backup_path, self.db_path)
            print(f"✅ Database restored from: {backup_path}")
            return True
            
        except Exception as e:
            print(f"❌ Error restoring database: {str(e)}")
            return False
    
    def check_database_status(self):
        """Check current database status and display statistics"""
        print("📊 Database Status Report")
        print("=" * 50)
        
        if not self.db_path.exists():
            print("❌ Database file does not exist")
            return
        
        db: Session = SessionLocal()
        
        try:
            # Check tables
            inspector = inspect(self.engine)
            tables = inspector.get_table_names()
            print(f"📋 Tables: {len(tables)} found")
            for table in tables:
                print(f"   - {table}")
            
            print()
            
            # Count records in each table
            if 'users' in tables:
                user_count = db.query(User).count()
                admin_count = db.query(User).filter(User.is_admin == True).count()
                print(f"👥 Users: {user_count} total ({admin_count} admins)")
            
            if 'categories' in tables:
                category_count = db.query(Category).count()
                print(f"📂 Categories: {category_count}")
            
            if 'products' in tables:
                product_count = db.query(Product).count()
                active_products = db.query(Product).filter(Product.is_active == True).count()
                print(f"📦 Products: {product_count} total ({active_products} active)")
            
            if 'banners' in tables:
                banner_count = db.query(Banner).count()
                active_banners = db.query(Banner).filter(Banner.is_active == True).count()
                print(f"🏷️  Banners: {banner_count} total ({active_banners} active)")
            
            # Database file size
            file_size = self.db_path.stat().st_size
            file_size_mb = file_size / (1024 * 1024)
            print(f"💾 Database size: {file_size_mb:.2f} MB")
            
        except Exception as e:
            print(f"❌ Error checking database: {str(e)}")
        finally:
            db.close()
    
    def seed_data(self, seeder_name=None):
        """Run database seeders"""
        if seeder_name == "admin":
            seed_admin_user()
        elif seeder_name == "products":
            run_all_seeders()
        elif seeder_name == "all":
            seed_admin_user()
            run_all_seeders()
        else:
            print("Available seeders: admin, products, all")
    
    def create_admin_user(self, username, email, password):
        """Create a new admin user"""
        from app.auth import get_password_hash
        
        db: Session = SessionLocal()
        
        try:
            # Check if user already exists
            existing = db.query(User).filter(
                (User.username == username) | (User.email == email)
            ).first()
            
            if existing:
                print(f"❌ User with username '{username}' or email '{email}' already exists")
                return False
            
            # Create new admin user
            admin_user = User(
                username=username,
                email=email,
                password_hash=get_password_hash(password),
                first_name="Admin",
                last_name="User",
                is_active=True,
                is_admin=True
            )
            
            db.add(admin_user)
            db.commit()
            
            print(f"✅ Admin user '{username}' created successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error creating admin user: {str(e)}")
            db.rollback()
            return False
        finally:
            db.close()


def main():
    """Main command-line interface"""
    parser = argparse.ArgumentParser(description="iShop Database Management")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Init command
    init_parser = subparsers.add_parser('init', help='Initialize database')
    init_parser.add_argument('--sample-data', action='store_true', 
                           help='Include sample data')
    
    # Reset command
    reset_parser = subparsers.add_parser('reset', help='Reset database')
    reset_parser.add_argument('--force', action='store_true',
                            help='Skip confirmation prompt')
    
    # Status command
    subparsers.add_parser('status', help='Check database status')
    
    # Backup command
    backup_parser = subparsers.add_parser('backup', help='Backup database')
    backup_parser.add_argument('--path', help='Backup file path')
    
    # Restore command
    restore_parser = subparsers.add_parser('restore', help='Restore database')
    restore_parser.add_argument('backup_path', help='Backup file path')
    
    # Seed command
    seed_parser = subparsers.add_parser('seed', help='Run database seeders')
    seed_parser.add_argument('seeder', choices=['admin', 'products', 'all'],
                           help='Seeder to run')
    
    # Create admin command
    admin_parser = subparsers.add_parser('create-admin', help='Create admin user')
    admin_parser.add_argument('username', help='Admin username')
    admin_parser.add_argument('email', help='Admin email')
    admin_parser.add_argument('password', help='Admin password')
    
    # Parse arguments
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return
    
    # Initialize database manager
    db_manager = DatabaseManager()
    
    # Execute commands
    if args.command == 'init':
        db_manager.init_database(with_sample_data=args.sample_data)
    
    elif args.command == 'reset':
        db_manager.reset_database(confirm=args.force)
    
    elif args.command == 'status':
        db_manager.check_database_status()
    
    elif args.command == 'backup':
        db_manager.backup_database(args.path)
    
    elif args.command == 'restore':
        db_manager.restore_database(args.backup_path)
    
    elif args.command == 'seed':
        db_manager.seed_data(args.seeder)
    
    elif args.command == 'create-admin':
        db_manager.create_admin_user(args.username, args.email, args.password)


if __name__ == "__main__":
    main()