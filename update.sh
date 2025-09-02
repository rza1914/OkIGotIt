#!/bin/bash

# Update Script for iShop Production Deployment
# Use this for deploying updates to production

set -e

# Configuration
APP_DIR="/opt/ishop"
APP_USER="ishop"
SERVICE_NAME="ishop"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[UPDATE]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root or with sudo"
    exit 1
fi

cd $APP_DIR

# Step 1: Create backup before update
print_status "Creating backup before update..."
./backup.sh

# Step 2: Stop the application
print_status "Stopping application service..."
systemctl stop $SERVICE_NAME

# Step 3: Update code from git
print_status "Updating code from repository..."
sudo -u $APP_USER git pull

# Step 4: Update Python dependencies
print_status "Updating Python dependencies..."
sudo -u $APP_USER ./venv/bin/pip install --upgrade pip
sudo -u $APP_USER ./venv/bin/pip install -r requirements.txt

# Step 5: Update Node.js dependencies and rebuild frontend
print_status "Updating Node.js dependencies..."
sudo -u $APP_USER npm install

print_status "Rebuilding frontend..."
sudo -u $APP_USER npm run build

# Step 6: Run database migrations (if any)
print_status "Running database migrations..."
if [ -f "migrations.py" ]; then
    sudo -u $APP_USER ./venv/bin/python migrations.py
else
    print_warning "No migration script found, skipping..."
fi

# Step 7: Update file permissions
print_status "Updating file permissions..."
chown -R $APP_USER:$APP_USER $APP_DIR

# Step 8: Reload systemd and restart services
print_status "Restarting services..."
systemctl daemon-reload
systemctl start $SERVICE_NAME
systemctl restart nginx

# Step 9: Verify services are running
print_status "Verifying services..."
sleep 3

if systemctl is-active --quiet $SERVICE_NAME; then
    print_status "✅ Application service is running"
else
    print_error "❌ Application service failed to start"
    print_error "Rolling back..."
    # Here you could add rollback logic
    systemctl status $SERVICE_NAME
    exit 1
fi

if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx failed to start"
    systemctl status nginx
fi

# Step 10: Health check
print_status "Performing health check..."
sleep 5

if curl -f -s http://localhost:8000/api/v1/health > /dev/null; then
    print_status "✅ Health check passed"
else
    print_warning "⚠️  Health check failed - check logs"
    print_warning "Check logs with: journalctl -u $SERVICE_NAME -f"
fi

print_status "🎉 Update completed successfully!"

# Show recent logs
print_status "Recent application logs:"
journalctl -u $SERVICE_NAME --no-pager -n 10