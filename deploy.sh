#!/bin/bash

# iShop E-commerce Deployment Script for Ubuntu Server
# Run this script on your Ubuntu server after SSH login

set -e  # Exit on any error

echo "🚀 Starting iShop deployment on Ubuntu server..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="ishop"
APP_USER="ishop"
APP_DIR="/opt/ishop"
GIT_REPO="https://github.com/yourusername/iShop.git"  # Replace with your repo
DOMAIN="yourdomain.com"  # Replace with your domain

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Update system packages
print_status "Step 1: Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install required packages
print_status "Step 2: Installing required packages..."
apt install -y python3 python3-pip python3-venv nodejs npm nginx git curl software-properties-common

# Install latest Node.js (18.x LTS)
print_status "Installing Node.js 18.x LTS..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Step 3: Create application user
print_status "Step 3: Creating application user..."
if ! id "$APP_USER" &>/dev/null; then
    useradd --system --shell /bin/bash --home $APP_DIR --create-home $APP_USER
    print_status "Created user: $APP_USER"
else
    print_warning "User $APP_USER already exists"
fi

# Step 4: Clone repository
print_status "Step 4: Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
    print_warning "Repository already exists, updating..."
    cd $APP_DIR
    sudo -u $APP_USER git pull
else
    print_status "Cloning fresh repository..."
    sudo -u $APP_USER git clone $GIT_REPO $APP_DIR
    chown -R $APP_USER:$APP_USER $APP_DIR
fi

cd $APP_DIR

# Step 5: Set up Python virtual environment
print_status "Step 5: Setting up Python virtual environment..."
sudo -u $APP_USER python3 -m venv venv
sudo -u $APP_USER ./venv/bin/pip install --upgrade pip
sudo -u $APP_USER ./venv/bin/pip install -r requirements.txt

# Step 6: Install Node.js dependencies and build frontend
print_status "Step 6: Installing Node.js dependencies and building frontend..."
sudo -u $APP_USER npm install
sudo -u $APP_USER npm run build

# Step 7: Set up environment variables
print_status "Step 7: Setting up environment variables..."
if [ ! -f "$APP_DIR/.env" ]; then
    sudo -u $APP_USER tee $APP_DIR/.env > /dev/null <<EOF
# Database
DATABASE_URL=sqlite:///./ishop.db

# Security
SECRET_KEY=$(openssl rand -hex 32)
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://$DOMAIN,https://$DOMAIN

# Server
HOST=0.0.0.0
PORT=8000

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_ADMIN_CHAT_IDS=

# Iranian Payment Gateways (Optional)
ZARINPAL_MERCHANT_ID=your-merchant-id
PAYPING_TOKEN=your-payping-token

# SMS Provider (Optional)
KAVENEGAR_API_KEY=your-kavenegar-key
EOF
    print_status "Created .env file - please update it with your actual values"
else
    print_warning ".env file already exists"
fi

# Step 8: Initialize database
print_status "Step 8: Initializing database..."
cd $APP_DIR
sudo -u $APP_USER ./venv/bin/python app/init_db.py
sudo -u $APP_USER ./venv/bin/python create_admin.py

# Step 9: Create systemd service
print_status "Step 9: Creating systemd service..."
tee /etc/systemd/system/ishop.service > /dev/null <<EOF
[Unit]
Description=iShop FastAPI E-commerce Application
After=network.target

[Service]
Type=simple
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
Environment=PATH=$APP_DIR/venv/bin
EnvironmentFile=$APP_DIR/.env
ExecStart=$APP_DIR/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
ExecReload=/bin/kill -HUP \$MAINPID
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Step 10: Configure nginx
print_status "Step 10: Configuring nginx..."
tee /etc/nginx/sites-available/ishop > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    client_max_body_size 100M;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Serve static files directly
    location /static/ {
        alias $APP_DIR/static/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # API routes
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Serve React SPA
    location / {
        root $APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Handle 404s for SPA routing
    error_page 404 = /index.html;
}
EOF

# Enable nginx site
if [ -L /etc/nginx/sites-enabled/ishop ]; then
    print_warning "nginx site already enabled"
else
    ln -s /etc/nginx/sites-available/ishop /etc/nginx/sites-enabled/
    print_status "Enabled nginx site"
fi

# Remove default nginx site if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    print_status "Removed default nginx site"
fi

# Test nginx configuration
nginx -t

# Step 11: Set up firewall (optional)
print_status "Step 11: Setting up UFW firewall..."
if command -v ufw >/dev/null 2>&1; then
    ufw allow ssh
    ufw allow 'Nginx Full'
    # Uncomment the next line to enable firewall
    # ufw --force enable
    print_status "Firewall configured (not enabled by default)"
fi

# Step 12: Start and enable services
print_status "Step 12: Starting and enabling services..."
systemctl daemon-reload
systemctl enable ishop
systemctl start ishop
systemctl enable nginx
systemctl restart nginx

# Step 13: Verify deployment
print_status "Step 13: Verifying deployment..."
sleep 3

if systemctl is-active --quiet ishop; then
    print_status "✅ iShop service is running"
else
    print_error "❌ iShop service failed to start"
    systemctl status ishop
fi

if systemctl is-active --quiet nginx; then
    print_status "✅ Nginx is running"
else
    print_error "❌ Nginx failed to start"
    systemctl status nginx
fi

# Final status
print_status "🎉 Deployment completed!"
echo ""
echo "==============================================="
echo "🎯 Next Steps:"
echo "1. Update $APP_DIR/.env with your actual configuration"
echo "2. Point your domain DNS to this server IP"
echo "3. Set up SSL with Let's Encrypt (optional):"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d $DOMAIN"
echo ""
echo "📊 Service Management:"
echo "  sudo systemctl status ishop    # Check status"
echo "  sudo systemctl restart ishop   # Restart app"
echo "  sudo systemctl logs ishop      # View logs"
echo ""
echo "🌐 Your app should be accessible at:"
echo "  http://$DOMAIN (or server IP)"
echo "  API docs: http://$DOMAIN/docs"
echo "==============================================="