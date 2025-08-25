# 🛍️ iShop - Persian E-commerce Platform
## پلتفرم فروشگاهی آی‌شاپ

<div align="center">

![iShop Logo](public/logo-iShop.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.8%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)](https://www.typescriptlang.org/)

**A complete Persian e-commerce platform built with FastAPI, React, and TypeScript**

[English](#english) | [فارسی](#persian)

</div>

---

## English

### 🌟 Features

- **🛒 Complete E-commerce Solution**: Product catalog, shopping cart, order management
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control
- **👨‍💼 Admin Dashboard**: Comprehensive admin panel for managing products, orders, and users
- **🌍 Persian/Farsi Support**: Full RTL (Right-to-Left) layout with Persian localization
- **📱 Responsive Design**: Modern UI with Tailwind CSS, optimized for all devices
- **💳 Iranian Payment Gateways**: Integration with ZarinPal, PayPing, IDPay, and more
- **📦 Order Management**: Complete order lifecycle from cart to delivery
- **👥 User Management**: Customer accounts, profiles, and order history
- **📊 Analytics Dashboard**: Sales analytics, user insights, and performance metrics
- **🔍 Advanced Search**: Product search with filters and categories
- **📧 Notification System**: Email and SMS notifications in Persian
- **🚚 Shipping Integration**: Iranian postal service and courier integration
- **💰 Multi-Currency Support**: Iranian Rial and Toman support with proper formatting
- **🔒 Security Features**: Rate limiting, input validation, and secure API endpoints

### 🏗️ Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (Database)
- JWT Authentication
- Pydantic (Data validation)

**Frontend:**
- React 18 with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Lucide Icons
- React Router
- Context API for state management

**Additional Tools:**
- Persian/Jalali date support
- Iranian phone number validation
- Persian text processing
- RTL layout support

### 🚀 Quick Start

#### Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

#### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/iShop.git
   cd iShop
   ```

2. **Backend Setup**
   ```bash
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # On Windows:
   venv\\Scripts\\activate
   # On macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   cp .env.example .env
   # Edit .env with your configuration
   
   # Initialize database
   python app/init_db.py
   
   # Create admin user
   python create_admin.py
   
   # Start backend server
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Frontend Setup**
   ```bash
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Admin Panel: http://localhost:5173/admin

### 📚 Documentation

- [Installation Guide](docs/installation.md)
- [API Documentation](docs/api.md)
- [Admin Dashboard Guide](docs/admin-guide.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)

### 🔧 Configuration

Key configuration options in `.env`:

```env
# Database
DATABASE_URL=sqlite:///./ishop.db

# Security
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Payment Gateways (Iranian)
ZARINPAL_MERCHANT_ID=your-merchant-id
PAYPING_TOKEN=your-payping-token

# SMS Provider
KAVENEGAR_API_KEY=your-kavenegar-key
```

### 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

### 🙏 Acknowledgments

- FastAPI for the amazing Python web framework
- React team for the powerful frontend library
- Iranian developer community for inspiration and support

---

## Persian

### 🌟 ویژگی‌ها

- **🛒 راه‌حل کامل فروشگاهی**: کاتالوگ محصولات، سبد خرید، مدیریت سفارشات
- **🔐 احراز هویت امن**: احراز هویت مبتنی بر JWT با کنترل دسترسی نقش‌محور
- **👨‍💼 پنل مدیریت**: پنل مدیریت جامع برای مدیریت محصولات، سفارشات و کاربران
- **🌍 پشتیبانی فارسی**: طراحی کامل راست‌چین با محلی‌سازی فارسی
- **📱 طراحی واکنش‌گرا**: رابط کاربری مدرن با Tailwind CSS، بهینه شده برای همه دستگاه‌ها
- **💳 درگاه‌های پرداخت ایرانی**: یکپارچه‌سازی با زرین‌پال، پی‌پینگ، آیدی‌پی و بیشتر
- **📦 مدیریت سفارشات**: چرخه کامل سفارش از سبد خرید تا تحویل
- **👥 مدیریت کاربران**: حساب‌های مشتری، پروفایل و تاریخچه سفارشات
- **📊 داشبورد آنالیتیک**: آنالیز فروش، بینش کاربران و معیارهای عملکرد
- **🔍 جستجوی پیشرفته**: جستجوی محصولات با فیلتر و دسته‌بندی
- **📧 سیستم اعلانات**: اعلانات ایمیل و پیامک به فارسی
- **🚚 یکپارچه‌سازی حمل‌ونقل**: یکپارچه‌سازی با پست ایران و پیک‌های خصوصی
- **💰 پشتیبانی چند ارزی**: پشتیبانی از ریال و تومان ایران با فرمت‌بندی مناسب
- **🔒 ویژگی‌های امنیتی**: محدودیت نرخ، اعتبارسنجی ورودی و نقاط پایانی API امن

### 🏗️ پشته فناوری

**بک‌اند:**
- FastAPI (فریم‌ورک وب پایتون)
- SQLAlchemy (ORM)
- SQLite/PostgreSQL (پایگاه داده)
- احراز هویت JWT
- Pydantic (اعتبارسنجی داده)

**فرانت‌اند:**
- React 18 با TypeScript
- Vite (ابزار ساخت)
- Tailwind CSS (استایل‌دهی)
- آیکون‌های Lucide
- React Router
- Context API برای مدیریت وضعیت

### 🚀 شروع سریع

#### پیش‌نیازها

- Python 3.8 یا بالاتر
- Node.js 16 یا بالاتر
- npm یا yarn

#### نصب

1. **کلون کردن مخزن**
   ```bash
   git clone https://github.com/yourusername/iShop.git
   cd iShop
   ```

2. **راه‌اندازی بک‌اند**
   ```bash
   # ایجاد محیط مجازی
   python -m venv venv
   
   # فعال‌سازی محیط مجازی
   # در ویندوز:
   venv\\Scripts\\activate
   # در macOS/Linux:
   source venv/bin/activate
   
   # نصب وابستگی‌ها
   pip install -r requirements.txt
   
   # تنظیم متغیرهای محیطی
   cp .env.example .env
   # فایل .env را با تنظیمات خود ویرایش کنید
   
   # مقداردهی اولیه پایگاه داده
   python app/init_db.py
   
   # ایجاد کاربر مدیر
   python create_admin.py
   
   # شروع سرور بک‌اند
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **راه‌اندازی فرانت‌اند**
   ```bash
   # نصب وابستگی‌ها
   npm install
   
   # شروع سرور توسعه
   npm run dev
   ```

4. **دسترسی به برنامه**
   - فرانت‌اند: http://localhost:5173
   - API بک‌اند: http://localhost:8000
   - مستندات API: http://localhost:8000/docs
   - پنل مدیر: http://localhost:5173/admin

### 🔧 پیکربندی

گزینه‌های کلیدی پیکربندی در `.env`:

```env
# پایگاه داده
DATABASE_URL=sqlite:///./ishop.db

# امنیت
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# درگاه‌های پرداخت (ایرانی)
ZARINPAL_MERCHANT_ID=your-merchant-id
PAYPING_TOKEN=your-payping-token

# ارائه‌دهنده پیامک
KAVENEGAR_API_KEY=your-kavenegar-key
```

### 🤝 مشارکت

1. مخزن را فورک کنید
2. شاخه ویژگی ایجاد کنید (`git checkout -b feature/AmazingFeature`)
3. تغییرات خود را کامیت کنید (`git commit -m 'Add some AmazingFeature'`)
4. به شاخه پوش کنید (`git push origin feature/AmazingFeature`)
5. درخواست Pull ایجاد کنید

### 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است - فایل [LICENSE](LICENSE) را برای جزئیات ببینید.

### 👥 نویسندگان

- **نام شما** - *کار اولیه* - [GitHub شما](https://github.com/yourusername)

### 🙏 قدردانی‌ها

- از FastAPI برای فریم‌ورک وب فوق‌العاده پایتون
- از تیم React برای کتابخانه قدرتمند فرانت‌اند
- از جامعه توسعه‌دهندگان ایرانی برای الهام و پشتیبانی

---

## 📞 Support | پشتیبانی

- **Issues**: [GitHub Issues](https://github.com/yourusername/iShop/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/iShop/discussions)
- **Email**: support@ishop.ir

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/iShop&type=Date)](https://star-history.com/#yourusername/iShop&Date)