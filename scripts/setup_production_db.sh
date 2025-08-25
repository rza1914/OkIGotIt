#!/bin/bash

# Production Database Setup Script for iShop
# This script sets up PostgreSQL database for production deployment

set -e  # Exit on any error

echo "🚀 Setting up iShop Production Database"
echo "======================================"

# Configuration variables
DB_NAME="${DB_NAME:-ishop_production}"
DB_USER="${DB_USER:-ishop_user}"
DB_PASSWORD="${DB_PASSWORD:-$(openssl rand -base64 32)}"
POSTGRES_VERSION="${POSTGRES_VERSION:-15}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Utility functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PostgreSQL is installed
check_postgresql() {
    log_info "Checking PostgreSQL installation..."
    
    if command -v psql >/dev/null 2>&1; then
        PG_VERSION=$(psql --version | grep -oP '\d+\.\d+' | head -1)
        log_success "PostgreSQL $PG_VERSION is installed"
    else
        log_error "PostgreSQL is not installed"
        log_info "Installing PostgreSQL $POSTGRES_VERSION..."
        
        # Install PostgreSQL based on OS
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Ubuntu/Debian
            if command -v apt-get >/dev/null 2>&1; then
                sudo apt-get update
                sudo apt-get install -y postgresql-$POSTGRES_VERSION postgresql-client-$POSTGRES_VERSION postgresql-contrib
            # CentOS/RHEL
            elif command -v yum >/dev/null 2>&1; then
                sudo yum install -y postgresql-server postgresql-contrib
                sudo postgresql-setup initdb
            fi
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command -v brew >/dev/null 2>&1; then
                brew install postgresql@$POSTGRES_VERSION
                brew services start postgresql@$POSTGRES_VERSION
            else
                log_error "Homebrew not found. Please install PostgreSQL manually."
                exit 1
            fi
        fi
        
        log_success "PostgreSQL installed successfully"
    fi
}

# Create database and user
setup_database() {
    log_info "Setting up database and user..."
    
    # Start PostgreSQL service if not running
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start postgresql
        sudo systemctl enable postgresql
    fi
    
    # Create database user
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';" || log_warning "User might already exist"
    
    # Create database
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || log_warning "Database might already exist"
    
    # Grant privileges
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    
    # Grant schema privileges
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;"
    sudo -u postgres psql -d $DB_NAME -c "GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;"
    
    log_success "Database and user created successfully"
}

# Configure PostgreSQL for production
configure_postgresql() {
    log_info "Configuring PostgreSQL for production..."
    
    # Find PostgreSQL config directory
    PG_CONFIG_DIR=$(sudo -u postgres psql -t -P format=unaligned -c 'show config_file;' | xargs dirname)
    
    log_info "PostgreSQL config directory: $PG_CONFIG_DIR"
    
    # Backup original configurations
    sudo cp $PG_CONFIG_DIR/postgresql.conf $PG_CONFIG_DIR/postgresql.conf.backup
    sudo cp $PG_CONFIG_DIR/pg_hba.conf $PG_CONFIG_DIR/pg_hba.conf.backup
    
    # Update postgresql.conf for production
    cat << EOF | sudo tee -a $PG_CONFIG_DIR/postgresql.conf.ishop

# iShop Production Configuration
listen_addresses = 'localhost'
max_connections = 100
shared_buffers = 128MB
effective_cache_size = 4GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_min_messages = warning
log_min_error_statement = error
log_connections = on
log_disconnections = on
log_lock_waits = on
log_temp_files = 0

# Security
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
password_encryption = scram-sha-256

EOF

    # Update pg_hba.conf for secure access
    sudo sed -i '/^local.*all.*all.*peer$/a local   '"$DB_NAME"'   '"$DB_USER"'                     md5' $PG_CONFIG_DIR/pg_hba.conf
    
    log_success "PostgreSQL configured for production"
}

# Create environment file
create_env_file() {
    log_info "Creating production environment file..."
    
    cat << EOF > .env.production.local
# Production Database Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME

# Security
SECRET_KEY=$(openssl rand -base64 64)
ALGORITHM=HS256

# Production Settings
ENVIRONMENT=production
DEBUG=false
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Email (Update with your SMTP settings)
SMTP_SERVER=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-smtp-password
SMTP_TLS=true

# Redis (if using)
REDIS_URL=redis://localhost:6379/0

# File Storage
UPLOAD_PATH=/var/www/ishop/uploads
MAX_FILE_SIZE=10485760

# Admin User (Change these!)
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=$(openssl rand -base64 12)

# Iranian Payment Gateways (Add your credentials)
ZARINPAL_MERCHANT_ID=your-zarinpal-merchant-id
IDPAY_API_KEY=your-idpay-api-key
PAYPING_TOKEN=your-payping-token

# SMS Service (Add your credentials)
KAVENEGAR_API_KEY=your-kavenegar-api-key

EOF

    chmod 600 .env.production.local
    log_success "Production environment file created: .env.production.local"
    log_warning "⚠️  Please update the credentials in .env.production.local"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Export database URL for Python script
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
    
    # Initialize database
    python3 manage_db.py init
    
    log_success "Database initialized successfully"
}

# Create systemd service (Linux only)
create_systemd_service() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        log_info "Creating systemd service for iShop..."
        
        cat << EOF | sudo tee /etc/systemd/system/ishop.service
[Unit]
Description=iShop E-commerce API
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=/var/www/ishop
Environment=PATH=/var/www/ishop/venv/bin
EnvironmentFile=/var/www/ishop/.env.production.local
ExecStart=/var/www/ishop/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

        sudo systemctl daemon-reload
        sudo systemctl enable ishop
        
        log_success "Systemd service created: ishop.service"
        log_info "Use 'sudo systemctl start ishop' to start the service"
    fi
}

# Main setup function
main() {
    log_info "Starting production database setup..."
    
    # Check for required commands
    for cmd in openssl python3 pip3; do
        if ! command -v $cmd >/dev/null 2>&1; then
            log_error "$cmd is required but not installed"
            exit 1
        fi
    done
    
    check_postgresql
    setup_database
    configure_postgresql
    create_env_file
    
    # Restart PostgreSQL to apply configuration
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl restart postgresql
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew services restart postgresql
    fi
    
    run_migrations
    create_systemd_service
    
    echo ""
    log_success "🎉 Production database setup completed!"
    echo ""
    echo "Database Details:"
    echo "  Name: $DB_NAME"
    echo "  User: $DB_USER" 
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo "Next steps:"
    echo "1. Update credentials in .env.production.local"
    echo "2. Configure SSL certificates"
    echo "3. Set up reverse proxy (nginx)"
    echo "4. Configure firewall rules"
    echo "5. Set up monitoring and backups"
    echo ""
    log_warning "⚠️  Save the database password securely!"
}

# Run main function
main "$@"