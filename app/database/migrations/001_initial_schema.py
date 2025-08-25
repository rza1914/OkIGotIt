"""
Initial database schema migration for iShop
Migration 001: Create core tables
"""

from sqlalchemy import text
from sqlalchemy.orm import Session
from app.database import engine
from app.models import Base


def upgrade():
    """Apply migration - create initial schema"""
    print("Running migration 001: Initial schema")
    
    # Create all tables defined in models
    Base.metadata.create_all(bind=engine)
    
    # Create database session for additional SQL commands
    with Session(engine) as session:
        # Create indexes for better performance
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
        """))
        
        session.execute(text("""
            CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active);
        """))
        
        session.commit()
    
    print("Migration 001 completed successfully")


def downgrade():
    """Rollback migration - drop all tables"""
    print("Rolling back migration 001: Dropping all tables")
    
    Base.metadata.drop_all(bind=engine)
    
    print("Migration 001 rollback completed")


if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "downgrade":
        downgrade()
    else:
        upgrade()