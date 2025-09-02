#!/bin/bash

# Database and Application Backup Script for iShop
# Run this script regularly via cron

set -e

# Configuration
APP_DIR="/opt/ishop"
BACKUP_DIR="/backup/ishop"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Colors
GREEN='\033[0;32m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[BACKUP]${NC} $1"
}

# Create backup directory
mkdir -p $BACKUP_DIR

print_status "Starting backup process..."

# Backup database
print_status "Backing up database..."
if [ -f "$APP_DIR/ishop.db" ]; then
    cp "$APP_DIR/ishop.db" "$BACKUP_DIR/ishop_db_$DATE.db"
    print_status "Database backup completed: ishop_db_$DATE.db"
fi

# Backup uploaded files/static content
print_status "Backing up static files..."
if [ -d "$APP_DIR/static" ]; then
    tar -czf "$BACKUP_DIR/static_$DATE.tar.gz" -C "$APP_DIR" static/
    print_status "Static files backup completed: static_$DATE.tar.gz"
fi

# Backup configuration
print_status "Backing up configuration..."
if [ -f "$APP_DIR/.env" ]; then
    cp "$APP_DIR/.env" "$BACKUP_DIR/env_$DATE.txt"
    print_status "Environment configuration backed up: env_$DATE.txt"
fi

# Create full application backup (excluding node_modules and __pycache__)
print_status "Creating full application backup..."
tar --exclude="node_modules" --exclude="__pycache__" --exclude="*.pyc" --exclude=".git" \
    -czf "$BACKUP_DIR/app_full_$DATE.tar.gz" -C "/opt" ishop/
print_status "Full application backup completed: app_full_$DATE.tar.gz"

# Clean old backups
print_status "Cleaning old backups (older than $RETENTION_DAYS days)..."
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete
print_status "Old backup cleanup completed"

# Display backup summary
print_status "Backup completed successfully!"
echo "Backup location: $BACKUP_DIR"
echo "Backup files created:"
ls -la $BACKUP_DIR/*$DATE*