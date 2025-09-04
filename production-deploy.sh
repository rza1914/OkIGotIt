#!/bin/bash

# OkIGotIt Production Deployment Script
# FastAPI + React E-commerce Application
# Author: Generated with Claude Code
# Version: 1.0.0

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# =============================================================================
# CONFIGURATION
# =============================================================================

SCRIPT_VERSION="1.0.0"
PROJECT_NAME="OkIGotIt"
GITHUB_REPO="https://github.com/rza1914/OkIGotIt"
SERVICE_NAME="ishop.service"
NGINX_SERVICE="nginx"

# Colors for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly NC='\033[0m' # No Color

# Deployment settings
BACKUP_DIR="/tmp/okigotit-backup-$(date +%Y%m%d_%H%M%S)"
DEPLOYMENT_LOG="/var/log/okigotit-deploy.log"
MAX_ROLLBACK_ATTEMPTS=3
HEALTH_CHECK_TIMEOUT=30
SERVICE_START_TIMEOUT=20

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

log() {
    local level="$1"
    shift
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] $*" | tee -a "$DEPLOYMENT_LOG"
}

print_info() { log "INFO" "${GREEN}[INFO]${NC} $*"; }
print_warn() { log "WARN" "${YELLOW}[WARN]${NC} $*"; }
print_error() { log "ERROR" "${RED}[ERROR]${NC} $*"; }
print_success() { log "SUCCESS" "${GREEN}[SUCCESS]${NC} $*"; }
print_header() { 
    echo -e "\n${PURPLE}========================================${NC}"
    echo -e "${PURPLE} $*${NC}"
    echo -e "${PURPLE}========================================${NC}\n"
    log "HEADER" "$*"
}

print_step() {
    echo -e "\n${CYAN}>>> Step: $*${NC}"
    log "STEP" "$*"
}

# Cleanup function for graceful exit
cleanup() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        print_error "Deployment failed! Check logs at $DEPLOYMENT_LOG"
        print_warn "Backup available at: $BACKUP_DIR"
        print_warn "Run './production-deploy.sh --rollback' to restore previous version"
    fi
    exit $exit_code
}

trap cleanup EXIT

# =============================================================================
# SYSTEM CHECKS
# =============================================================================

check_prerequisites() {
    print_step "Checking system prerequisites"
    
    local missing_tools=()
    
    # Check required tools
    command -v git >/dev/null || missing_tools+=("git")
    command -v node >/dev/null || missing_tools+=("nodejs")
    command -v npm >/dev/null || missing_tools+=("npm")
    command -v python3 >/dev/null || missing_tools+=("python3")
    command -v pip3 >/dev/null || missing_tools+=("python3-pip")
    command -v systemctl >/dev/null || missing_tools+=("systemd")
    command -v nginx >/dev/null || missing_tools+=("nginx")
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_info "Install missing tools and try again"
        exit 1
    fi
    
    # Check if running as root or with sudo privileges
    if [[ $EUID -ne 0 ]] && ! sudo -n true 2>/dev/null; then
        print_error "This script requires root privileges or passwordless sudo"
        print_info "Run with: sudo $0 or configure passwordless sudo"
        exit 1
    fi
    
    print_success "All prerequisites satisfied"
}

find_project_directory() {
    print_step "Locating project directory"
    
    local search_paths=(
        "/opt/$PROJECT_NAME"
        "/var/www/$PROJECT_NAME"
        "/home/$(logname 2>/dev/null || echo $USER)/$PROJECT_NAME"
        "/usr/local/src/$PROJECT_NAME"
        "/srv/$PROJECT_NAME"
    )
    
    for path in "${search_paths[@]}"; do
        if [[ -d "$path" && -d "$path/.git" ]]; then
            PROJECT_DIR="$path"
            print_success "Found project at: $PROJECT_DIR"
            return 0
        fi
    done
    
    print_warn "Project not found in common locations, searching filesystem..."
    local found_dirs=$(find / -name "$PROJECT_NAME" -type d 2>/dev/null | head -10)
    
    if [[ -z "$found_dirs" ]]; then
        print_error "Could not locate $PROJECT_NAME project directory"
        print_info "Please ensure the project is cloned and accessible"
        exit 1
    fi
    
    print_info "Found potential directories:"
    echo "$found_dirs"
    exit 1
}

# =============================================================================
# BACKUP FUNCTIONS
# =============================================================================

create_backup() {
    print_step "Creating backup of current deployment"
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup current code
    if [[ -d "$PROJECT_DIR" ]]; then
        print_info "Backing up project files..."
        cp -r "$PROJECT_DIR" "$BACKUP_DIR/project" 2>/dev/null || {
            print_warn "Could not backup all project files (permissions?)"
        }
    fi
    
    # Backup current git commit
    if [[ -d "$PROJECT_DIR/.git" ]]; then
        cd "$PROJECT_DIR"
        git rev-parse HEAD > "$BACKUP_DIR/current_commit.txt"
        git log -1 --pretty=format:"%h - %s (%cr)" > "$BACKUP_DIR/commit_info.txt"
        print_info "Current commit: $(cat $BACKUP_DIR/commit_info.txt)"
    fi
    
    # Backup service status
    systemctl is-active "$SERVICE_NAME" > "$BACKUP_DIR/service_status.txt" 2>/dev/null || echo "inactive" > "$BACKUP_DIR/service_status.txt"
    systemctl is-active "$NGINX_SERVICE" > "$BACKUP_DIR/nginx_status.txt" 2>/dev/null || echo "inactive" > "$BACKUP_DIR/nginx_status.txt"
    
    print_success "Backup created at: $BACKUP_DIR"
}

# =============================================================================
# DEPLOYMENT FUNCTIONS
# =============================================================================

update_source_code() {
    print_step "Updating source code from git"
    
    cd "$PROJECT_DIR"
    
    # Fetch latest changes
    print_info "Fetching latest changes..."
    git fetch origin
    
    # Check if we're behind
    local behind_count=$(git rev-list HEAD..origin/main --count 2>/dev/null || echo "0")
    if [[ "$behind_count" -eq "0" ]]; then
        print_info "Already up to date with remote"
        return 0
    fi
    
    print_info "Pulling $behind_count new commits..."
    git pull origin main
    
    # Show what changed
    local new_commit=$(git log -1 --pretty=format:"%h - %s (%cr)")
    print_success "Updated to: $new_commit"
}

update_python_dependencies() {
    print_step "Managing Python dependencies"
    
    cd "$PROJECT_DIR"
    
    # Check if virtual environment exists
    if [[ ! -d ".venv" ]]; then
        print_info "Creating Python virtual environment..."
        python3 -m venv .venv
    fi
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Upgrade pip
    print_info "Upgrading pip..."
    pip install --upgrade pip
    
    # Install/update requirements
    if [[ -f "requirements.txt" ]]; then
        print_info "Installing Python dependencies from requirements.txt..."
        pip install -r requirements.txt
    elif [[ -f "pyproject.toml" ]]; then
        print_info "Installing Python dependencies from pyproject.toml..."
        pip install -e .
    else
        print_warn "No requirements.txt or pyproject.toml found"
    fi
    
    print_success "Python dependencies updated"
}

update_node_dependencies() {
    print_step "Managing Node.js dependencies"
    
    cd "$PROJECT_DIR"
    
    if [[ ! -f "package.json" ]]; then
        print_warn "No package.json found, skipping Node.js dependencies"
        return 0
    fi
    
    # Check Node.js version
    local node_version=$(node --version)
    print_info "Using Node.js: $node_version"
    
    # Install dependencies
    print_info "Installing Node.js dependencies..."
    npm ci --production=false
    
    print_success "Node.js dependencies updated"
}

build_frontend() {
    print_step "Building React frontend"
    
    cd "$PROJECT_DIR"
    
    if [[ ! -f "package.json" ]]; then
        print_warn "No package.json found, skipping frontend build"
        return 0
    fi
    
    # Build production frontend
    print_info "Building production frontend..."
    npm run build
    
    # Verify build output
    if [[ ! -d "dist" ]] && [[ ! -d "build" ]]; then
        print_error "Frontend build failed - no dist/ or build/ directory found"
        return 1
    fi
    
    local build_dir="dist"
    [[ -d "build" ]] && build_dir="build"
    
    local build_size=$(du -sh "$build_dir" | cut -f1)
    print_success "Frontend built successfully (Size: $build_size)"
}

# =============================================================================
# SERVICE MANAGEMENT
# =============================================================================

restart_services() {
    print_step "Restarting services"
    
    # Stop services gracefully
    print_info "Stopping $SERVICE_NAME..."
    sudo systemctl stop "$SERVICE_NAME" || {
        print_warn "Could not stop $SERVICE_NAME (may not be running)"
    }
    
    # Wait a moment for graceful shutdown
    sleep 2
    
    # Start FastAPI service
    print_info "Starting $SERVICE_NAME..."
    sudo systemctl start "$SERVICE_NAME"
    
    # Wait for service to start
    local attempts=0
    while [[ $attempts -lt $SERVICE_START_TIMEOUT ]]; do
        if systemctl is-active --quiet "$SERVICE_NAME"; then
            print_success "$SERVICE_NAME started successfully"
            break
        fi
        sleep 1
        ((attempts++))
    done
    
    if [[ $attempts -eq $SERVICE_START_TIMEOUT ]]; then
        print_error "$SERVICE_NAME failed to start within ${SERVICE_START_TIMEOUT}s"
        return 1
    fi
    
    # Reload nginx
    print_info "Reloading nginx configuration..."
    sudo systemctl reload "$NGINX_SERVICE"
    
    print_success "All services restarted successfully"
}

# =============================================================================
# HEALTH CHECKS
# =============================================================================

verify_deployment() {
    print_step "Verifying deployment health"
    
    local health_checks_passed=0
    local total_checks=4
    
    # Check service status
    print_info "Checking $SERVICE_NAME status..."
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        print_success "✅ $SERVICE_NAME is running"
        ((health_checks_passed++))
    else
        print_error "❌ $SERVICE_NAME is not running"
        sudo systemctl status "$SERVICE_NAME" --no-pager -l
    fi
    
    # Check nginx status
    print_info "Checking nginx status..."
    if systemctl is-active --quiet "$NGINX_SERVICE"; then
        print_success "✅ Nginx is running"
        ((health_checks_passed++))
    else
        print_error "❌ Nginx is not running"
        sudo systemctl status "$NGINX_SERVICE" --no-pager -l
    fi
    
    # Test local HTTP connection
    print_info "Testing local HTTP connection..."
    if curl -s -f -m 10 http://localhost >/dev/null 2>&1; then
        print_success "✅ Local HTTP connection successful"
        ((health_checks_passed++))
    else
        print_error "❌ Local HTTP connection failed"
    fi
    
    # Test API health endpoint
    print_info "Testing API health endpoint..."
    local api_endpoints=("/api/health" "/health" "/api/docs" "/docs")
    local api_healthy=false
    
    for endpoint in "${api_endpoints[@]}"; do
        if curl -s -f -m 10 "http://localhost${endpoint}" >/dev/null 2>&1; then
            print_success "✅ API endpoint $endpoint is responding"
            api_healthy=true
            break
        fi
    done
    
    if [[ "$api_healthy" == "true" ]]; then
        ((health_checks_passed++))
    else
        print_error "❌ No API endpoints responding"
    fi
    
    # Overall health assessment
    echo ""
    print_info "Health Check Results: $health_checks_passed/$total_checks checks passed"
    
    if [[ $health_checks_passed -ge 3 ]]; then
        print_success "🎉 Deployment is healthy!"
        return 0
    else
        print_error "💥 Deployment has issues!"
        return 1
    fi
}

show_deployment_status() {
    print_step "Deployment Status Summary"
    
    echo ""
    echo -e "${BLUE}=== Deployment Information ===${NC}"
    echo -e "Script Version: $SCRIPT_VERSION"
    echo -e "Project Directory: $PROJECT_DIR"
    echo -e "Deployment Time: $(date)"
    echo -e "Backup Location: $BACKUP_DIR"
    
    echo ""
    echo -e "${BLUE}=== Git Information ===${NC}"
    cd "$PROJECT_DIR"
    echo -e "Current Branch: $(git branch --show-current)"
    echo -e "Latest Commit: $(git log -1 --pretty=format:'%h - %s (%cr) <%an>')"
    echo -e "Repository Status: $(git status --porcelain | wc -l) uncommitted changes"
    
    echo ""
    echo -e "${BLUE}=== Service Status ===${NC}"
    sudo systemctl status "$SERVICE_NAME" --no-pager -l | head -10
    
    echo ""
    echo -e "${BLUE}=== Recent Logs ===${NC}"
    echo "FastAPI Service Logs (last 5 lines):"
    sudo journalctl -u "$SERVICE_NAME" --no-pager -n 5 --since "5 minutes ago"
    
    echo ""
    echo -e "${BLUE}=== Performance Info ===${NC}"
    echo -e "System Load: $(uptime | awk -F'load average:' '{print $2}')"
    echo -e "Memory Usage: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
    echo -e "Disk Usage: $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 ")"}')"
}

# =============================================================================
# ROLLBACK FUNCTIONS
# =============================================================================

rollback_deployment() {
    print_header "Rolling Back Deployment"
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        print_error "No backup found at $BACKUP_DIR"
        print_info "Available backups:"
        ls -la /tmp/okigotit-backup-* 2>/dev/null || echo "No backups found"
        exit 1
    fi
    
    print_step "Restoring from backup"
    
    # Restore previous commit
    if [[ -f "$BACKUP_DIR/current_commit.txt" ]]; then
        cd "$PROJECT_DIR"
        local previous_commit=$(cat "$BACKUP_DIR/current_commit.txt")
        print_info "Restoring to commit: $previous_commit"
        git reset --hard "$previous_commit"
    fi
    
    # Restore service status
    local previous_service_status=$(cat "$BACKUP_DIR/service_status.txt" 2>/dev/null || echo "inactive")
    if [[ "$previous_service_status" == "active" ]]; then
        print_info "Restarting services..."
        restart_services
    fi
    
    print_success "Rollback completed successfully"
}

# =============================================================================
# MAIN DEPLOYMENT FUNCTION
# =============================================================================

main_deployment() {
    print_header "$PROJECT_NAME Production Deployment v$SCRIPT_VERSION"
    
    # Initialize deployment log
    sudo touch "$DEPLOYMENT_LOG"
    sudo chmod 644 "$DEPLOYMENT_LOG"
    
    print_info "Starting deployment process..."
    print_info "Logs will be saved to: $DEPLOYMENT_LOG"
    
    # Execute deployment steps
    check_prerequisites
    find_project_directory
    create_backup
    
    print_info "Proceeding with deployment..."
    update_source_code
    update_python_dependencies
    update_node_dependencies
    build_frontend
    restart_services
    
    # Verify deployment
    if verify_deployment; then
        show_deployment_status
        print_header "🎉 DEPLOYMENT SUCCESSFUL! 🎉"
        print_success "Your $PROJECT_NAME application is now updated and running"
        print_info "Access your application at your configured domain/IP"
    else
        print_header "💥 DEPLOYMENT FAILED! 💥"
        print_error "Deployment verification failed"
        print_warn "Consider running rollback: $0 --rollback"
        exit 1
    fi
}

# =============================================================================
# SCRIPT ENTRY POINT
# =============================================================================

show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h        Show this help message"
    echo "  --rollback        Rollback to previous deployment"
    echo "  --status          Show current deployment status"
    echo "  --version         Show script version"
    echo ""
    echo "Examples:"
    echo "  $0                Deploy latest changes"
    echo "  $0 --rollback     Rollback to previous version"
    echo "  $0 --status       Check current status"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_usage
        exit 0
        ;;
    --rollback)
        rollback_deployment
        exit 0
        ;;
    --status)
        find_project_directory 2>/dev/null || exit 1
        show_deployment_status
        exit 0
        ;;
    --version)
        echo "$PROJECT_NAME Deployment Script v$SCRIPT_VERSION"
        exit 0
        ;;
    "")
        main_deployment
        ;;
    *)
        print_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac