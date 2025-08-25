"""
Security configuration for iShop API
"""
import secrets
from typing import List
from pydantic_settings import BaseSettings


class SecuritySettings(BaseSettings):
    """Security-related configuration"""
    
    # JWT Configuration
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Password Security
    BCRYPT_ROUNDS: int = 12
    MIN_PASSWORD_LENGTH: int = 8
    REQUIRE_UPPERCASE: bool = True
    REQUIRE_LOWERCASE: bool = True
    REQUIRE_DIGITS: bool = True
    REQUIRE_SPECIAL_CHARS: bool = True
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 100
    RATE_LIMIT_BURST: int = 200
    LOGIN_ATTEMPTS_LIMIT: int = 5
    LOGIN_LOCKOUT_MINUTES: int = 15
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://yourdomain.com"
    ]
    ALLOWED_METHODS: List[str] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    ALLOWED_HEADERS: List[str] = [
        "Accept",
        "Accept-Language", 
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With"
    ]
    
    # Security Headers
    ENABLE_SECURITY_HEADERS: bool = True
    HSTS_MAX_AGE: int = 31536000  # 1 year
    
    # Content Security Policy
    CSP_DEFAULT_SRC: List[str] = ["'self'"]
    CSP_SCRIPT_SRC: List[str] = ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"]
    CSP_STYLE_SRC: List[str] = ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]
    CSP_IMG_SRC: List[str] = ["'self'", "data:", "https:"]
    CSP_FONT_SRC: List[str] = ["'self'", "https://fonts.gstatic.com"]
    CSP_CONNECT_SRC: List[str] = ["'self'"]
    
    # File Upload Security
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_EXTENSIONS: List[str] = [
        ".jpg", ".jpeg", ".png", ".gif", ".webp",
        ".pdf", ".doc", ".docx", ".txt"
    ]
    UPLOAD_PATH: str = "uploads"
    
    # Database Security
    DB_POOL_SIZE: int = 5
    DB_MAX_OVERFLOW: int = 10
    DB_POOL_TIMEOUT: int = 30
    
    # Session Security
    SESSION_COOKIE_SECURE: bool = True
    SESSION_COOKIE_HTTPONLY: bool = True
    SESSION_COOKIE_SAMESITE: str = "lax"
    
    # API Security
    ENABLE_API_KEY_AUTH: bool = False
    API_KEY_HEADER: str = "X-API-Key"
    
    class Config:
        env_file = ".env"
        env_prefix = "SECURITY_"


# Password validation regex patterns
PASSWORD_PATTERNS = {
    "uppercase": r"[A-Z]",
    "lowercase": r"[a-z]", 
    "digits": r"\d",
    "special": r"[!@#$%^&*(),.?\":{}|<>]"
}

# Security middleware configuration
SECURITY_MIDDLEWARE_CONFIG = {
    "force_https": False,  # Set to True in production
    "hsts_max_age": 31536000,
    "hsts_include_subdomains": True,
    "hsts_preload": False,
    "content_type_nosniff": True,
    "referrer_policy": "strict-origin-when-cross-origin",
    "permissions_policy": {
        "geolocation": [],
        "microphone": [],
        "camera": []
    }
}

# Trusted proxies (for rate limiting behind reverse proxy)
TRUSTED_PROXIES = [
    "127.0.0.1",
    "::1"
]

# Security event logging
SECURITY_EVENTS_TO_LOG = [
    "login_attempt",
    "login_success", 
    "login_failure",
    "password_change",
    "account_lockout",
    "suspicious_activity",
    "file_upload",
    "api_key_usage"
]