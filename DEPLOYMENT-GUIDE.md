# OkIGotIt Production Deployment Guide

## 🚀 Quick Start

### Copy Script to Server
```bash
scp production-deploy.sh root@193.163.201.112:/usr/local/bin/
ssh root@193.163.201.112 "chmod +x /usr/local/bin/production-deploy.sh"
```

### Run Deployment
```bash
ssh root@193.163.201.112
/usr/local/bin/production-deploy.sh
```

## 📋 Features

### ✅ Production-Ready Features
- **Automated Backup**: Creates timestamped backups before deployment
- **Rollback Capability**: One-command rollback to previous version
- **Health Checks**: Comprehensive verification of deployment success
- **Error Handling**: Graceful failure handling with detailed logging
- **Service Management**: Intelligent restart of FastAPI and Nginx services
- **Dependency Management**: Updates both Python and Node.js dependencies
- **Security**: Requires proper privileges and validates prerequisites

### 🛠 Available Commands

| Command | Description |
|---------|-------------|
| `./production-deploy.sh` | Run full deployment |
| `./production-deploy.sh --rollback` | Rollback to previous version |
| `./production-deploy.sh --status` | Show current deployment status |
| `./production-deploy.sh --help` | Show usage information |
| `./production-deploy.sh --version` | Show script version |

## 📖 Deployment Process

### 1. Pre-flight Checks
- ✅ Validates required tools (git, node, python3, systemctl, nginx)
- ✅ Checks for proper permissions (root/sudo access)
- ✅ Locates project directory automatically

### 2. Backup Creation
- 📦 Creates timestamped backup in `/tmp/okigotit-backup-YYYYMMDD_HHMMSS`
- 📝 Records current git commit and service status
- 🔄 Enables quick rollback if needed

### 3. Source Code Update
- 🔄 Fetches latest changes from GitHub
- 📊 Shows number of new commits being pulled
- 📋 Displays what changed in the update

### 4. Dependency Management
- 🐍 **Python**: Creates/updates virtual environment, installs from requirements.txt
- 📦 **Node.js**: Runs `npm ci` to install exact dependency versions
- ⚡ Uses production-optimized installation methods

### 5. Frontend Build
- 🏗️ Builds React frontend with `npm run build`
- 📏 Reports build size and verifies output directory
- 🎯 Optimized for production deployment

### 6. Service Management
- ⏹️ Gracefully stops FastAPI service
- ▶️ Starts service with timeout monitoring
- 🔄 Reloads Nginx configuration
- ⏱️ Waits for services to stabilize

### 7. Health Verification
- 🔍 **Service Status**: Checks if ishop.service and nginx are running
- 🌐 **HTTP Test**: Verifies local HTTP connection works
- 🏥 **API Health**: Tests API endpoints (/api/health, /health, /docs)
- 📊 **Results**: Shows pass/fail status for each check

### 8. Status Report
- 📈 Git information (branch, latest commit, changes)
- 🔧 Service status and recent logs
- 💻 System performance metrics (load, memory, disk)
- 📍 Backup location and deployment details

## 🆘 Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
# Solution: Run with sudo or as root
sudo ./production-deploy.sh
```

#### 2. Project Directory Not Found
```bash
# Check where your project is located
find / -name "OkIGotIt" -type d 2>/dev/null

# Update script if in custom location
# Edit the search_paths array in find_project_directory()
```

#### 3. Service Start Failure
```bash
# Check service logs
sudo journalctl -u ishop.service -f

# Check service configuration
sudo systemctl status ishop.service
```

#### 4. Frontend Build Failure
```bash
# Check Node.js version
node --version  # Should be >= 16

# Clear npm cache
npm cache clean --force

# Manual build debug
cd /path/to/project
npm install
npm run build
```

### 🔙 Emergency Rollback

If deployment fails or causes issues:

```bash
# Automatic rollback
./production-deploy.sh --rollback

# Manual rollback
cd /path/to/project
git log --oneline -5  # Find previous commit
git reset --hard <previous-commit-hash>
sudo systemctl restart ishop.service
sudo systemctl reload nginx
```

## 📊 Monitoring

### Real-time Logs
```bash
# FastAPI service logs
sudo journalctl -u ishop.service -f

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Deployment logs
tail -f /var/log/okigotit-deploy.log
```

### Health Checks
```bash
# Quick health check
curl -I http://localhost

# API documentation
curl http://localhost/docs

# Service status
sudo systemctl status ishop.service nginx
```

## 🔧 Configuration

### Environment Variables
Ensure these are set on your server:
```bash
# Production environment
export NODE_ENV=production
export FASTAPI_ENV=production

# Database configuration
export DATABASE_URL="sqlite:///./ishop.db"  # or PostgreSQL URL

# Security settings
export SECRET_KEY="your-secret-key"
export ALLOWED_HOSTS="your-domain.com,193.163.201.112"
```

### Service Configuration
Your `ishop.service` should be configured like:
```ini
[Unit]
Description=OkIGotIt FastAPI Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/project
Environment=PATH=/path/to/project/.venv/bin
ExecStart=/path/to/project/.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## 📈 Performance Optimization

### Before Deployment
- 🧹 **Cleanup**: Remove unused dependencies and files
- 🗜️ **Compression**: Enable gzip in Nginx configuration
- 📦 **Bundling**: Optimize frontend build settings
- 🗃️ **Database**: Run database migrations if needed

### After Deployment
- 📊 **Monitor**: Check CPU, memory, and disk usage
- 🔍 **Profile**: Use FastAPI's built-in profiling tools
- 🚀 **Optimize**: Identify and fix performance bottlenecks
- 📈 **Scale**: Consider load balancing for high traffic

## 🔐 Security Best Practices

1. **Run as non-root user** when possible
2. **Use HTTPS** with proper SSL certificates
3. **Keep dependencies updated** regularly
4. **Monitor logs** for security issues
5. **Use environment variables** for secrets
6. **Enable firewall** and restrict access
7. **Regular backups** of database and code

## 📞 Support

If you encounter issues:

1. **Check logs** first: `/var/log/okigotit-deploy.log`
2. **Verify prerequisites** are installed
3. **Ensure proper permissions** are set
4. **Test manually** each deployment step
5. **Use rollback** if deployment fails

---

**Generated with [Claude Code](https://claude.ai/code)**  
**Script Version**: 1.0.0  
**Last Updated**: $(date +%Y-%m-%d)