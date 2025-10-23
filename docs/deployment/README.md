# 🚀 Deployment Guide

Complete guide for deploying iShop e-commerce platform to production.

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Deployment Methods](#deployment-methods)
3. [Prerequisites](#prerequisites)
4. [Production Checklist](#production-checklist)

---

## 🎯 Quick Start

### One-Command Deployment

```bash
# Copy script to server
scp production-deploy.sh root@YOUR_SERVER_IP:/usr/local/bin/

# Run deployment
ssh root@YOUR_SERVER_IP
chmod +x /usr/local/bin/production-deploy.sh
/usr/local/bin/production-deploy.sh
```

That's it! The script will handle:
- ✅ Backup creation
- ✅ Code updates
- ✅ Dependency installation
- ✅ Frontend build
- ✅ Service restart
- ✅ Health checks

---

## 🛠 Deployment Methods

### 1. Automated Script Deployment
**Best for:** Quick production deployments

```bash
./production-deploy.sh
```

**Features:**
- Automatic backups
- Rollback capability
- Health verification
- Zero-downtime deployment

[📖 Full Guide](./quick-start.md)

---

### 2. Docker Deployment
**Best for:** Consistent environments, scaling

```bash
docker-compose up -d
```

**Features:**
- Container isolation
- Easy scaling
- Consistent environments
- Simple rollback

[📖 Docker Guide](./docker.md)

---

### 3. Manual Deployment
**Best for:** Custom configurations, learning

Follow step-by-step instructions for manual setup.

[📖 Manual Guide](./manual.md)

---

## ✅ Prerequisites

### Server Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **OS** | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| **CPU** | 2 cores | 4 cores |
| **RAM** | 2 GB | 4 GB+ |
| **Disk** | 20 GB | 50 GB+ SSD |
| **Network** | 100 Mbps | 1 Gbps |

### Software Requirements

- **Python:** 3.11 or higher
- **Node.js:** 18.x LTS or higher
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Web Server:** Nginx
- **Process Manager:** Systemd
- **Git:** Latest version

### Domain & DNS

- Domain name pointed to server IP
- DNS records configured (A record, optionally CNAME)
- SSL certificate (Let's Encrypt recommended)

---

## 📝 Production Checklist

### Before Deployment

- [ ] **Server provisioned** with required specs
- [ ] **Domain configured** and DNS propagated
- [ ] **SSH access** set up (key-based auth recommended)
- [ ] **Firewall configured** (UFW or iptables)
  - Allow: 80 (HTTP), 443 (HTTPS), 22 (SSH)
  - Deny: All other ports
- [ ] **Backup strategy** planned
- [ ] **Monitoring** tools ready

### Configuration

- [ ] **Environment variables** set
  - `SECRET_KEY` - Strong random key
  - `DATABASE_URL` - Production database
  - `ALLOWED_HOSTS` - Your domain
  - `TELEGRAM_BOT_TOKEN` - If using Telegram features
- [ ] **Database** configured and tested
- [ ] **Payment gateways** configured
  - Zarinpal credentials
  - PayPing credentials
  - Bank gateway credentials
- [ ] **Email/SMS** providers configured

### Security

- [ ] **SSL certificate** installed
- [ ] **Firewall** enabled and configured
- [ ] **SSH key authentication** enabled
- [ ] **Root login** disabled
- [ ] **Fail2ban** installed and configured
- [ ] **Strong passwords** set for all accounts
- [ ] **Environment variables** secured (not in git)
- [ ] **CORS origins** properly configured
- [ ] **Rate limiting** enabled
- [ ] **Database backups** automated

### Application

- [ ] **Admin user** created
- [ ] **Static files** served correctly
- [ ] **Media uploads** directory writable
- [ ] **Database migrations** run
- [ ] **Sample data** seeded (optional)
- [ ] **API endpoints** tested
- [ ] **Frontend build** completed successfully

### Services

- [ ] **FastAPI service** running and enabled
- [ ] **Nginx** configured and running
- [ ] **SSL auto-renewal** set up (certbot)
- [ ] **Log rotation** configured
- [ ] **Monitoring agents** installed

### Post-Deployment

- [ ] **Health checks** passing
- [ ] **API documentation** accessible
- [ ] **Frontend** loading correctly
- [ ] **Test orders** processed successfully
- [ ] **Payment flow** tested
- [ ] **Email notifications** working
- [ ] **Admin panel** accessible
- [ ] **Monitoring dashboards** set up

---

## 🔍 Deployment Methods Comparison

| Feature | Automated Script | Docker | Manual |
|---------|-----------------|---------|--------|
| **Setup Time** | 5-10 minutes | 10-15 minutes | 30-60 minutes |
| **Difficulty** | Easy | Medium | Advanced |
| **Customization** | Limited | Medium | Full |
| **Rollback** | Built-in | Easy | Manual |
| **Scaling** | Manual | Easy | Manual |
| **Best For** | Quick deploys | Production | Learning |

---

## 🚀 Deployment Steps Overview

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv \
  nodejs npm nginx git curl ufw

# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### 2. Clone Repository

```bash
cd /opt
sudo git clone https://github.com/yourusername/iShop.git
cd iShop
```

### 3. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env
```

### 4. Backend Setup

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python app/init_db.py

# Create admin user
python create_admin.py
```

### 5. Frontend Build

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

### 6. Service Configuration

```bash
# Create systemd service
sudo nano /etc/systemd/system/ishop.service

# Enable and start
sudo systemctl enable ishop
sudo systemctl start ishop
```

### 7. Nginx Setup

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/ishop

# Enable site
sudo ln -s /etc/nginx/sites-available/ishop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. SSL Certificate

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 Useful Commands

### Service Management

```bash
# Check service status
sudo systemctl status ishop

# Restart service
sudo systemctl restart ishop

# View logs
sudo journalctl -u ishop -f
```

### Nginx

```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Updates

```bash
# Pull latest changes
cd /opt/iShop
sudo git pull

# Update and restart
./update.sh
```

### Backups

```bash
# Create backup
./backup.sh

# Restore backup
./restore.sh backup_file.tar.gz
```

---

## 📊 Monitoring

### Health Check

```bash
curl http://localhost:8000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "database": "connected"
}
```

### System Metrics

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Network
netstat -tuln
```

### Application Logs

```bash
# Backend logs
sudo journalctl -u ishop -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🆘 Troubleshooting

### Service Won't Start

```bash
# Check service status
sudo systemctl status ishop

# View detailed logs
sudo journalctl -u ishop -n 50 --no-pager

# Check port availability
sudo netstat -tuln | grep 8000
```

### Frontend Not Loading

```bash
# Check if build exists
ls -la dist/

# Rebuild frontend
npm run build

# Check nginx config
sudo nginx -t
```

### Database Connection Issues

```bash
# Check database file permissions
ls -la ishop.db

# Check database connection in logs
sudo journalctl -u ishop | grep database
```

---

## 📚 Additional Resources

- [Quick Start Guide](./quick-start.md) - Automated deployment
- [Docker Guide](./docker.md) - Container-based deployment
- [Manual Guide](./manual.md) - Step-by-step manual setup
- [SSL Setup](./ssl.md) - SSL certificate configuration
- [Production Best Practices](./production.md) - Optimization tips

---

## 🤝 Support

Need help with deployment?

- 📖 Check our [full documentation](../)
- 🐛 [Report issues](https://github.com/yourusername/iShop/issues)
- 💬 [Ask in discussions](https://github.com/yourusername/iShop/discussions)
- 📧 [Email support](mailto:support@ishop.com)

---

**Ready to deploy?** Choose your deployment method above and get started! 🚀
