#!/bin/bash

# OkIGotIt Server Update Script
# Run this on your Linux server to update the deployment

set -e  # Exit on any error

echo "🚀 Starting OkIGotIt deployment update..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Find the project directory
PROJECT_DIR=""
if [ -d "/opt/OkIGotIt" ]; then
    PROJECT_DIR="/opt/OkIGotIt"
elif [ -d "/var/www/OkIGotIt" ]; then
    PROJECT_DIR="/var/www/OkIGotIt"
elif [ -d "/home/$(whoami)/OkIGotIt" ]; then
    PROJECT_DIR="/home/$(whoami)/OkIGotIt"
else
    print_error "Could not find OkIGotIt project directory!"
    echo "Searching for project..."
    find / -name "OkIGotIt" -type d 2>/dev/null | head -5
    exit 1
fi

print_status "Found project at: $PROJECT_DIR"

# Navigate to project directory
cd "$PROJECT_DIR"

# Step 1: Pull latest changes
print_status "Pulling latest changes from GitHub..."
git pull origin main

# Step 2: Install/update dependencies if package.json changed
if [ -f "package.json" ]; then
    print_status "Installing/updating Node.js dependencies..."
    npm install
fi

# Step 3: Build React frontend
print_status "Building React frontend..."
npm run build

# Step 4: Restart FastAPI service
print_status "Restarting FastAPI service (ishop.service)..."
if systemctl is-active --quiet ishop.service; then
    sudo systemctl restart ishop.service
    print_status "ishop.service restarted successfully"
else
    print_warning "ishop.service was not running, starting it..."
    sudo systemctl start ishop.service
fi

# Step 5: Reload nginx
print_status "Reloading nginx configuration..."
sudo systemctl reload nginx

# Step 6: Check service status
print_status "Checking service status..."
echo ""
echo "=== ishop.service Status ==="
sudo systemctl status ishop.service --no-pager -l

echo ""
echo "=== nginx Status ==="
sudo systemctl status nginx --no-pager -l

# Step 7: Test the deployment
print_status "Testing deployment..."
echo ""

# Test local connection
if curl -s -I http://localhost > /dev/null; then
    print_status "✅ Local HTTP connection successful"
else
    print_error "❌ Local HTTP connection failed"
fi

# Test API endpoint
if curl -s http://localhost/api/health > /dev/null; then
    print_status "✅ API health check successful"
else
    print_warning "⚠️  API health check failed or endpoint doesn't exist"
fi

# Show recent logs
echo ""
print_status "Recent ishop.service logs:"
sudo journalctl -u ishop.service --no-pager -n 10

echo ""
print_status "🎉 Deployment update completed!"
print_status "Your application should now be running the latest version."

# Show final status
echo ""
echo "=== Final Status ==="
echo "Project Directory: $PROJECT_DIR"
echo "Git Status: $(git log -1 --pretty=format:'%h - %s (%cr)')"
echo "Build Directory: $PROJECT_DIR/dist"
echo ""
print_status "Deployment update finished successfully! 🚀"