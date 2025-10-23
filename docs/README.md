# 📚 iShop Documentation

Welcome to the complete documentation for **iShop** - a modern, full-featured e-commerce platform built with FastAPI and React.

---

## 📖 Table of Contents

### 🚀 Getting Started
- [Quick Start Guide](#quick-start-guide)
- [Installation](./development/setup.md)
- [Configuration](./development/configuration.md)

### 🔌 API Documentation
- [API Overview](./api/README.md)
- [Authentication](./api/authentication.md)
- [Products & Categories](./api/products.md)
- [Orders & Payments](./api/orders.md)
- [Shopping Cart](./api/cart.md)
- [User Management](./api/users.md)
- [Common Patterns](./api/common.md) (Errors, Pagination, Rate Limiting)

### 🛠 Development
- [Development Setup](./development/setup.md)
- [Database Schema](./development/database.md)
- [Testing Guide](./development/testing.md)
- [Contributing Guidelines](./development/contributing.md)

### 🚀 Deployment
- [Deployment Overview](./deployment/README.md)
- [Quick Start Deployment](./deployment/quick-start.md)
- [Docker Deployment](./deployment/docker.md)
- [Production Setup](./deployment/production.md)
- [SSL Configuration](./deployment/ssl.md)

### 🔐 Security
- [Security Best Practices](./security/best-practices.md)
- [Authentication & Authorization](./security/auth.md)
- [API Security](./security/api-security.md)

### 📊 Features
- [Product Management](./features/products.md)
- [Order Processing](./features/orders.md)
- [Payment Integration](./features/payments.md)
- [User Management](./features/users.md)
- [Admin Dashboard](./features/admin.md)
- [Telegram Bot Integration](./features/telegram-bot.md)

---

## 🎯 Quick Start Guide

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **SQLite** (default) or **PostgreSQL**
- **Git**

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/iShop.git
cd iShop
```

#### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python app/init_db.py

# Create admin user
python create_admin.py

# Run backend server
uvicorn app.main:app --reload --port 8000
```

#### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### 4. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs
- **API Docs (ReDoc):** http://localhost:8000/redoc

---

## 🏗 Project Structure

```
iShop/
├── app/                      # Backend (FastAPI)
│   ├── api/                  # API routes
│   │   └── v1/               # API version 1
│   │       ├── auth.py       # Authentication endpoints
│   │       ├── products.py   # Product endpoints
│   │       ├── orders.py     # Order endpoints
│   │       └── users.py      # User endpoints
│   ├── core/                 # Core functionality
│   │   ├── config.py         # Configuration
│   │   ├── security.py       # Security utilities
│   │   └── database.py       # Database connection
│   ├── models/               # Database models
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   └── main.py               # Application entry point
├── src/                      # Frontend (React + TypeScript)
│   ├── components/           # React components
│   ├── pages/                # Page components
│   ├── services/             # API services
│   ├── store/                # State management
│   ├── types/                # TypeScript types
│   └── utils/                # Utility functions
├── docs/                     # Documentation
│   ├── api/                  # API documentation
│   ├── development/          # Development guides
│   └── deployment/           # Deployment guides
├── static/                   # Static files
├── uploads/                  # User uploads
├── tests/                    # Test files
├── docker-compose.yml        # Docker configuration
├── requirements.txt          # Python dependencies
└── package.json              # Node.js dependencies
```

---

## ✨ Key Features

### 🛍️ E-commerce Core
- ✅ Product catalog with categories
- ✅ Shopping cart management
- ✅ Order processing and tracking
- ✅ Multiple payment gateways (Zarinpal, PayPing, Mellat)
- ✅ User authentication and profiles
- ✅ Product reviews and ratings
- ✅ Wishlist functionality
- ✅ Discount codes and coupons

### 👨‍💼 Admin Features
- ✅ Product management (CRUD)
- ✅ Order management and status updates
- ✅ User management
- ✅ Sales analytics and reports
- ✅ Inventory tracking
- ✅ Category management

### 🔐 Security
- ✅ JWT-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention

### 📱 Modern UI
- ✅ Responsive design (mobile-first)
- ✅ RTL support (Persian/Arabic)
- ✅ Dark mode support
- ✅ Toast notifications
- ✅ Loading states and error handling
- ✅ Optimistic UI updates

### 🤖 Telegram Bot Integration
- ✅ Order notifications
- ✅ Product search
- ✅ Order status tracking
- ✅ Customer support

---

## 🔧 Technology Stack

### Backend
- **FastAPI** - Modern, fast Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation
- **JWT** - Authentication
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS
- **Zustand** - State management
- **React Router** - Routing
- **React Query** - Data fetching

### Database
- **SQLite** (development)
- **PostgreSQL** (production recommended)

### Deployment
- **Docker** - Containerization
- **Nginx** - Web server & reverse proxy
- **Systemd** - Service management

---

## 📊 API Overview

### Base URL
- Development: `http://localhost:8000/api/v1`
- Production: `https://your-domain.com/api/v1`

### Authentication
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### Example Request
```bash
curl http://localhost:8000/api/v1/products \
  -H "Authorization: Bearer YOUR_TOKEN"
```

See [API Documentation](./api/README.md) for complete API reference.

---

## 🚀 Deployment

### Quick Deployment

```bash
# Copy deployment script to server
scp production-deploy.sh root@YOUR_SERVER_IP:/usr/local/bin/

# SSH to server and run
ssh root@YOUR_SERVER_IP
/usr/local/bin/production-deploy.sh
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

See [Deployment Guide](./deployment/README.md) for detailed instructions.

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/test_products.py
```

### Frontend Tests

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# E2E tests
npm run test:e2e
```

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guidelines](./development/contributing.md) before submitting a PR.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Documentation Structure

```
docs/
├── README.md                 # This file
├── api/                      # API Documentation
│   ├── README.md             # API Overview
│   ├── authentication.md     # Auth endpoints
│   ├── products.md           # Product endpoints
│   ├── orders.md             # Order endpoints
│   ├── cart.md               # Cart endpoints
│   ├── users.md              # User endpoints
│   └── common.md             # Common patterns
├── deployment/               # Deployment Guides
│   ├── README.md             # Deployment overview
│   ├── quick-start.md        # Quick deployment
│   ├── docker.md             # Docker deployment
│   ├── production.md         # Production setup
│   └── ssl.md                # SSL configuration
└── development/              # Development Guides
    ├── setup.md              # Setup guide
    ├── database.md           # Database schema
    ├── testing.md            # Testing guide
    └── contributing.md       # Contributing guide
```

---

## 📞 Support & Resources

### Documentation
- 📖 [Full API Documentation](./api/README.md)
- 🚀 [Deployment Guide](./deployment/README.md)
- 🛠 [Development Guide](./development/setup.md)

### Community
- 💬 [GitHub Discussions](https://github.com/yourusername/iShop/discussions)
- 🐛 [Issue Tracker](https://github.com/yourusername/iShop/issues)
- 📧 [Email Support](mailto:support@ishop.com)

### Interactive API Docs
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)

---

## 📈 Roadmap

### Version 1.1 (Q1 2024)
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Wishlist sharing

### Version 1.2 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] PWA support
- [ ] Live chat support
- [ ] Advanced analytics dashboard

### Version 2.0 (Q3 2024)
- [ ] Multi-vendor marketplace
- [ ] Subscription products
- [ ] Affiliate program
- [ ] Advanced shipping options

---

**Happy Coding!** 🚀

*Last Updated: 2024-01-10*
