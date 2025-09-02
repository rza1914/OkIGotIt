# 🚀 iShop Production Deployment Guide

## Prerequisites
- Ubuntu 20.04+ or CentOS 8+ server
- Root or sudo access
- Domain name pointed to your server
- Git repository with your code

## Quick Deployment

### 1. Connect to Your Server
```bash
ssh root@your-server-ip
```

### 2. Download and Run Deployment Script
```bash
# Clone your repository or upload the deployment script
curl -O https://your-repo/deploy.sh
chmod +x deploy.sh

# Edit the configuration in the script
nano deploy.sh
# Update: GIT_REPO, DOMAIN variables

# Run deployment
./deploy.sh
```

### 3. Configure Environment
```bash
# Edit environment variables
nano /opt/ishop/.env

# Update with your actual values:
# - SECRET_KEY (auto-generated)
# - TELEGRAM_BOT_TOKEN (if using Telegram features)
# - Payment gateway credentials
# - SMS provider credentials
```

### 4. Set Up SSL (Optional but Recommended)
```bash
chmod +x setup-ssl.sh
./setup-ssl.sh yourdomain.com your-email@domain.com
```

## Manual Deployment Steps

If you prefer manual deployment, follow these steps:

### 1. System Preparation
```bash
# Update system
apt update && apt upgrade -y

# Install required packages
apt install -y python3 python3-pip python3-venv nodejs npm nginx git curl

# Install Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

### 2. Create Application User
```bash
useradd --system --shell /bin/bash --home /opt/ishop --create-home ishop
```

### 3. Clone Repository
```bash
sudo -u ishop git clone https://github.com/yourusername/iShop.git /opt/ishop
chown -R ishop:ishop /opt/ishop
```

### 4. Backend Setup
```bash
cd /opt/ishop
sudo -u ishop python3 -m venv venv
sudo -u ishop ./venv/bin/pip install -r requirements.txt
sudo -u ishop ./venv/bin/python app/init_db.py
sudo -u ishop ./venv/bin/python create_admin.py
```

### 5. Frontend Setup
```bash
cd /opt/ishop
sudo -u ishop npm install
sudo -u ishop npm run build
```

### 6. Systemd Service
Create `/etc/systemd/system/ishop.service`:
```ini
[Unit]
Description=iShop FastAPI E-commerce Application
After=network.target

[Service]
Type=simple
User=ishop
Group=ishop
WorkingDirectory=/opt/ishop
Environment=PATH=/opt/ishop/venv/bin
EnvironmentFile=/opt/ishop/.env
ExecStart=/opt/ishop/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### 7. Nginx Configuration
Create `/etc/nginx/sites-available/ishop`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    client_max_body_size 100M;
    
    # Serve static files
    location /static/ {
        alias /opt/ishop/static/;
        expires 30d;
    }

    # API routes
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React SPA
    location / {
        root /opt/ishop/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

### 8. Enable and Start Services
```bash
# Enable nginx site
ln -s /etc/nginx/sites-available/ishop /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Start services
systemctl daemon-reload
systemctl enable ishop nginx
systemctl start ishop nginx
```

## Production Management

### Service Management
```bash
# Check status
systemctl status ishop
systemctl status nginx

# View logs
journalctl -u ishop -f
tail -f /var/log/nginx/error.log

# Restart services
systemctl restart ishop
systemctl restart nginx
```

### Updates
```bash
# Use the update script
chmod +x update.sh
./update.sh
```

### Backups
```bash
# Set up automated backups
chmod +x backup.sh
echo "0 2 * * * root /opt/ishop/backup.sh" >> /etc/crontab
```

### SSL Setup
```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test renewal
certbot renew --dry-run
```

## Monitoring

### Health Check
```bash
curl http://localhost:8000/api/v1/health
```

### Log Locations
- Application logs: `journalctl -u ishop`
- Nginx access: `/var/log/nginx/access.log`
- Nginx errors: `/var/log/nginx/error.log`

### Performance Monitoring
```bash
# System resources
htop
df -h
free -m

# Application metrics
curl http://localhost:8000/docs  # API documentation
```

## Troubleshooting

### Common Issues

1. **Service won't start**
   ```bash
   systemctl status ishop
   journalctl -u ishop -n 50
   ```

2. **Frontend not loading**
   ```bash
   # Check if build exists
   ls -la /opt/ishop/dist/
   
   # Check nginx configuration
   nginx -t
   ```

3. **Database issues**
   ```bash
   # Check database file
   ls -la /opt/ishop/ishop.db
   
   # Reset database
   sudo -u ishop ./venv/bin/python app/init_db.py
   ```

4. **Permission issues**
   ```bash
   chown -R ishop:ishop /opt/ishop
   chmod -R 755 /opt/ishop
   ```

### Performance Tuning

1. **Increase workers for production**
   Edit `/etc/systemd/system/ishop.service`:
   ```ini
   ExecStart=/opt/ishop/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```

2. **Database optimization**
   - Consider moving to PostgreSQL for better performance
   - Set up database connection pooling
   - Enable database backups

3. **Nginx optimization**
   - Enable gzip compression
   - Set up proper caching headers
   - Configure rate limiting

## Security Checklist

- [ ] SSL certificate installed
- [ ] Firewall configured (UFW)
- [ ] Regular backups scheduled
- [ ] Strong passwords for admin accounts
- [ ] Environment variables secured
- [ ] Regular system updates
- [ ] Monitoring set up

## Support

For issues or questions:
1. Check the logs first
2. Verify configuration files
3. Test individual components
4. Check GitHub issues
5. Contact support team

---

🎉 **Your iShop e-commerce platform is now deployed and ready for production!**