#!/bin/bash

# Database Backup Script for iShop
# Automated database backup with rotation and compression

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_ROOT/backups}"
DB_NAME="${DB_NAME:-ishop_production}"
DB_USER="${DB_USER:-ishop_user}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Create backup directory
create_backup_dir() {
    if [[ ! -d "$BACKUP_DIR" ]]; then
        mkdir -p "$BACKUP_DIR"
        log_info "Created backup directory: $BACKUP_DIR"
    fi
}

# Backup PostgreSQL database
backup_postgresql() {
    local backup_file="$BACKUP_DIR/ishop_postgres_$TIMESTAMP.sql"
    local compressed_file="$backup_file.gz"
    
    log_info "Starting PostgreSQL backup..."
    
    # Check if database exists
    if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
        log_error "Database '$DB_NAME' does not exist"
        return 1
    fi
    
    # Create backup
    sudo -u postgres pg_dump "$DB_NAME" > "$backup_file"
    
    # Compress backup
    gzip "$backup_file"
    
    # Get file size
    local file_size=$(du -h "$compressed_file" | cut -f1)
    
    log_success "PostgreSQL backup completed: $compressed_file ($file_size)"
}

# Backup SQLite database
backup_sqlite() {
    local db_file="$PROJECT_ROOT/ishop.db"
    local backup_file="$BACKUP_DIR/ishop_sqlite_$TIMESTAMP.db"
    local compressed_file="$backup_file.gz"
    
    if [[ ! -f "$db_file" ]]; then
        log_warning "SQLite database not found: $db_file"
        return 1
    fi
    
    log_info "Starting SQLite backup..."
    
    # Create backup using SQLite .backup command
    sqlite3 "$db_file" ".backup $backup_file"
    
    # Compress backup
    gzip "$backup_file"
    
    # Get file size
    local file_size=$(du -h "$compressed_file" | cut -f1)
    
    log_success "SQLite backup completed: $compressed_file ($file_size)"
}

# Backup uploaded files
backup_uploads() {
    local uploads_dir="$PROJECT_ROOT/uploads"
    local backup_file="$BACKUP_DIR/ishop_uploads_$TIMESTAMP.tar.gz"
    
    if [[ ! -d "$uploads_dir" ]]; then
        log_warning "Uploads directory not found: $uploads_dir"
        return 1
    fi
    
    log_info "Starting uploads backup..."
    
    # Create compressed archive
    tar -czf "$backup_file" -C "$PROJECT_ROOT" uploads/
    
    # Get file size
    local file_size=$(du -h "$backup_file" | cut -f1)
    
    log_success "Uploads backup completed: $backup_file ($file_size)"
}

# Clean old backups
cleanup_old_backups() {
    log_info "Cleaning up backups older than $RETENTION_DAYS days..."
    
    local deleted_count=0
    
    # Find and delete old backup files
    while IFS= read -r -d '' file; do
        rm "$file"
        ((deleted_count++))
        log_info "Deleted old backup: $(basename "$file")"
    done < <(find "$BACKUP_DIR" -name "ishop_*" -type f -mtime +$RETENTION_DAYS -print0 2>/dev/null)
    
    if [[ $deleted_count -eq 0 ]]; then
        log_info "No old backups to clean up"
    else
        log_success "Cleaned up $deleted_count old backup files"
    fi
}

# Verify backup integrity
verify_backup() {
    local backup_file="$1"
    
    if [[ ! -f "$backup_file" ]]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi
    
    # Test if gzip file is valid
    if [[ "$backup_file" == *.gz ]]; then
        if gzip -t "$backup_file"; then
            log_success "Backup integrity verified: $(basename "$backup_file")"
        else
            log_error "Backup integrity check failed: $(basename "$backup_file")"
            return 1
        fi
    fi
}

# Send notification (if configured)
send_notification() {
    local status="$1"
    local message="$2"
    
    # Email notification (if mail is configured)
    if command -v mail >/dev/null 2>&1 && [[ -n "${BACKUP_NOTIFICATION_EMAIL:-}" ]]; then
        echo "$message" | mail -s "iShop Backup $status" "$BACKUP_NOTIFICATION_EMAIL"
    fi
    
    # Webhook notification (if configured)
    if [[ -n "${BACKUP_WEBHOOK_URL:-}" ]]; then
        curl -X POST -H "Content-Type: application/json" \
             -d "{\"text\":\"iShop Backup $status: $message\"}" \
             "$BACKUP_WEBHOOK_URL" >/dev/null 2>&1 || true
    fi
}

# Generate backup report
generate_report() {
    log_info "Generating backup report..."
    
    local report_file="$BACKUP_DIR/backup_report_$TIMESTAMP.txt"
    
    cat << EOF > "$report_file"
iShop Database Backup Report
===========================
Date: $(date)
Backup Directory: $BACKUP_DIR
Retention Period: $RETENTION_DAYS days

Recent Backups:
$(ls -la "$BACKUP_DIR"/ishop_*_*.* 2>/dev/null | tail -10 || echo "No backups found")

Disk Usage:
$(du -sh "$BACKUP_DIR" 2>/dev/null || echo "Cannot calculate disk usage")

Available Space:
$(df -h "$BACKUP_DIR" 2>/dev/null || echo "Cannot check available space")
EOF

    log_success "Backup report generated: $report_file"
}

# Main backup function
main() {
    local backup_type="${1:-auto}"
    
    log_info "Starting iShop database backup (type: $backup_type)"
    
    create_backup_dir
    
    local backup_success=true
    local backup_files=()
    
    # Determine which databases to backup
    case "$backup_type" in
        "postgres"|"postgresql")
            if backup_postgresql; then
                backup_files+=("$BACKUP_DIR/ishop_postgres_$TIMESTAMP.sql.gz")
            else
                backup_success=false
            fi
            ;;
        "sqlite")
            if backup_sqlite; then
                backup_files+=("$BACKUP_DIR/ishop_sqlite_$TIMESTAMP.db.gz")
            else
                backup_success=false
            fi
            ;;
        "all"|"auto")
            # Try PostgreSQL first, fallback to SQLite
            if backup_postgresql; then
                backup_files+=("$BACKUP_DIR/ishop_postgres_$TIMESTAMP.sql.gz")
            elif backup_sqlite; then
                backup_files+=("$BACKUP_DIR/ishop_sqlite_$TIMESTAMP.db.gz")
            else
                backup_success=false
            fi
            ;;
        *)
            log_error "Unknown backup type: $backup_type"
            echo "Usage: $0 [postgres|sqlite|all]"
            exit 1
            ;;
    esac
    
    # Always try to backup uploads
    if backup_uploads; then
        backup_files+=("$BACKUP_DIR/ishop_uploads_$TIMESTAMP.tar.gz")
    fi
    
    # Verify backup integrity
    for backup_file in "${backup_files[@]}"; do
        verify_backup "$backup_file"
    done
    
    # Cleanup old backups
    cleanup_old_backups
    
    # Generate report
    generate_report
    
    # Send notification
    if [[ "$backup_success" == true ]]; then
        local message="Backup completed successfully. Files: $(printf '%s ' "${backup_files[@]}")"
        send_notification "Success" "$message"
        log_success "🎉 Backup process completed successfully!"
    else
        local message="Backup failed. Please check the logs."
        send_notification "Failed" "$message"
        log_error "❌ Backup process failed!"
        exit 1
    fi
}

# Parse command line arguments
case "${1:-}" in
    "-h"|"--help")
        echo "iShop Database Backup Script"
        echo ""
        echo "Usage: $0 [backup_type]"
        echo ""
        echo "Backup Types:"
        echo "  postgres    - Backup PostgreSQL database only"
        echo "  sqlite      - Backup SQLite database only"
        echo "  all|auto    - Auto-detect and backup available database (default)"
        echo ""
        echo "Environment Variables:"
        echo "  BACKUP_DIR              - Backup directory (default: ./backups)"
        echo "  RETENTION_DAYS          - Days to keep backups (default: 30)"
        echo "  DB_NAME                 - Database name (default: ishop_production)"
        echo "  BACKUP_NOTIFICATION_EMAIL - Email for notifications"
        echo "  BACKUP_WEBHOOK_URL      - Webhook URL for notifications"
        exit 0
        ;;
    *)
        main "${1:-auto}"
        ;;
esac