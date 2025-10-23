# 🛠 Development Setup Guide

Complete guide for setting up iShop development environment.

---

## 📋 Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **Python** | 3.11+ | [python.org](https://python.org) |
| **Node.js** | 18.x LTS | [nodejs.org](https://nodejs.org) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |
| **VS Code** | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

### Optional Tools

- **PostgreSQL** - For production-like database
- **Docker** - For containerized development
- **Postman/Insomnia** - For API testing
- **Redis** - For caching (future feature)

---

## 🚀 Quick Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/iShop.git
cd iShop
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Initialize database
python app/init_db.py

# Seed sample data
python seed_data.py

# Create admin user
python create_admin.py
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local file (if needed)
cp .env.example .env.local
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Application
APP_NAME=iShop
APP_VERSION=1.0.0
DEBUG=True
SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=sqlite:///./ishop.db
# For PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/ishop

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Telegram Bot (Optional)
TELEGRAM_BOT_TOKEN=your-telegram-bot-token

# Payment Gateways (Development)
ZARINPAL_MERCHANT_ID=your-merchant-id
ZARINPAL_SANDBOX=True

PAYPING_TOKEN=your-payping-token
PAYPING_SANDBOX=True

# SMS Provider (Optional)
SMS_API_KEY=your-sms-api-key
SMS_SENDER=your-sender-number

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=iShop
VITE_ENABLE_DEVTOOLS=true
```

---

## 📁 Project Structure

```
iShop/
├── app/                          # Backend (FastAPI)
│   ├── api/                      # API routes
│   │   └── v1/                   # API version 1
│   │       ├── __init__.py
│   │       ├── auth.py           # Authentication endpoints
│   │       ├── products.py       # Product endpoints
│   │       ├── orders.py         # Order endpoints
│   │       ├── cart.py           # Cart endpoints
│   │       └── users.py          # User endpoints
│   ├── core/                     # Core functionality
│   │   ├── config.py             # App configuration
│   │   ├── security.py           # Security utilities
│   │   ├── database.py           # Database connection
│   │   └── dependencies.py       # FastAPI dependencies
│   ├── models/                   # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── cart.py
│   ├── schemas/                  # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── cart.py
│   ├── services/                 # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── product_service.py
│   │   ├── order_service.py
│   │   └── payment_service.py
│   ├── utils/                    # Utility functions
│   │   ├── __init__.py
│   │   ├── email.py
│   │   ├── sms.py
│   │   └── helpers.py
│   ├── __init__.py
│   ├── init_db.py                # Database initialization
│   └── main.py                   # Application entry point
│
├── src/                          # Frontend (React + TypeScript)
│   ├── components/               # React components
│   │   ├── common/               # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── products/             # Product components
│   │   ├── cart/                 # Cart components
│   │   └── orders/               # Order components
│   ├── pages/                    # Page components
│   │   ├── Home.tsx
│   │   ├── Products.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── Orders.tsx
│   │   └── Admin/                # Admin pages
│   ├── services/                 # API services
│   │   ├── api.ts                # Axios configuration
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── cartService.ts
│   │   └── orderService.ts
│   ├── store/                    # Zustand store
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── productStore.ts
│   ├── types/                    # TypeScript types
│   │   ├── api.ts
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── user.ts
│   ├── utils/                    # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── styles/                   # Global styles
│   │   └── globals.css
│   ├── App.tsx                   # Main App component
│   └── main.tsx                  # Entry point
│
├── static/                       # Static files
│   ├── images/
│   └── icons/
│
├── uploads/                      # User uploads
│   ├── products/
│   ├── avatars/
│   └── temp/
│
├── tests/                        # Test files
│   ├── backend/                  # Backend tests
│   │   ├── test_auth.py
│   │   ├── test_products.py
│   │   └── test_orders.py
│   └── frontend/                 # Frontend tests
│       ├── components/
│       └── pages/
│
├── docs/                         # Documentation
│
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── requirements.txt              # Python dependencies
├── package.json                  # Node dependencies
├── tsconfig.json                 # TypeScript config
├── vite.config.ts                # Vite config
├── tailwind.config.js            # Tailwind config
└── README.md                     # Main README
```

---

## 🎨 VS Code Setup

### Recommended Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "ms-python.vscode-pylance",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "usernamehw.errorlens",
    "eamodio.gitlens"
  ]
}
```

### Workspace Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python",
    "editor.formatOnSave": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 🧪 Running Tests

### Backend Tests

```bash
# Install test dependencies
pip install pytest pytest-cov pytest-asyncio

# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_products.py

# Run specific test
pytest tests/test_products.py::test_get_products
```

### Frontend Tests

```bash
# Install test dependencies (if not included)
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 🔍 Development Tools

### API Testing

**Using curl:**
```bash
# Get products
curl http://localhost:8000/api/v1/products

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Using httpie:**
```bash
# Install httpie
pip install httpie

# Get products
http GET http://localhost:8000/api/v1/products

# Login
http POST http://localhost:8000/api/v1/auth/login \
  email=admin@example.com password=admin123
```

### Database Management

**View database:**
```bash
# Using SQLite CLI
sqlite3 ishop.db

# View tables
.tables

# View schema
.schema products

# Query data
SELECT * FROM products;
```

**Using DB Browser:**
- Download: [sqlitebrowser.org](https://sqlitebrowser.org/)
- Open `ishop.db` file

### Debugging

**Backend (Python):**
```python
# Add breakpoint in code
import pdb; pdb.set_trace()

# Or use VS Code debugger
# Add configuration in .vscode/launch.json
```

**Frontend (TypeScript):**
```typescript
// Add debugger statement
debugger;

// Or use browser DevTools
console.log('Debug info:', data);
```

---

## 📦 Adding Dependencies

### Backend

```bash
# Activate virtual environment
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt
```

### Frontend

```bash
# Install package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update all packages
npm update
```

---

## 🔄 Common Development Tasks

### Reset Database

```bash
# Backup first
cp ishop.db ishop.db.backup

# Delete database
rm ishop.db

# Recreate
python app/init_db.py
python seed_data.py
python create_admin.py
```

### Clear Cache

```bash
# Python cache
find . -type d -name __pycache__ -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Node modules
rm -rf node_modules
npm install
```

### Update Dependencies

```bash
# Python
pip install --upgrade pip
pip list --outdated
pip install --upgrade package-name

# Node.js
npm outdated
npm update
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8000
kill -9 <PID>
```

### Virtual Environment Issues

```bash
# Delete and recreate
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Database Locked

```bash
# Close all connections and restart
# Or delete .db-journal file
rm ishop.db-journal
```

### Frontend Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

---

## 📚 Additional Resources

- [API Documentation](../api/README.md)
- [Database Schema](./database.md)
- [Testing Guide](./testing.md)
- [Contributing Guidelines](./contributing.md)

---

## 🤝 Getting Help

- 📖 Check documentation
- 🐛 [Report issues](https://github.com/yourusername/iShop/issues)
- 💬 [Join discussions](https://github.com/yourusername/iShop/discussions)

---

**Happy coding!** 🚀
