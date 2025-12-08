
"""
Application Configuration
Uses Pydantic Settings for environment variable management
"""

from functools import lru_cache
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """

    # ---- Application ----
    APP_NAME: str = "NIRD Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=True, env="DEBUG")
    ENVIRONMENT: str = Field(default="development", env="ENVIRONMENT")

    # ---- Database ----
    DATABASE_URL: str = Field(
        default="postgresql+psycopg2://nird_user:nird_password@localhost:5432/nird_db",
        env="DATABASE_URL"
    )
    DB_ECHO: bool = Field(default=False, env="DB_ECHO")
    
    @field_validator("DATABASE_URL")
    @classmethod
    def fix_database_url(cls, v: str) -> str:
        """Fix DATABASE_URL format for Render (postgres:// -> postgresql+psycopg2://)"""
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql+psycopg2://", 1)
        elif v and v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+psycopg2://", 1)
        return v
    # ---- JWT Authentication ----
    SECRET_KEY: str = Field(default="your-secret-key-change-in-production", env="SECRET_KEY")
    ALGORITHM: str = Field(default="HS256", env="ALGORITHM")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24 * 7, env="ACCESS_TOKEN_EXPIRE_MINUTES")  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=30, env="REFRESH_TOKEN_EXPIRE_DAYS")

    # ---- CORS ----
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:3000"],
        env="CORS_ORIGINS",
    )
    CORS_ALLOW_CREDENTIALS: bool = Field(default=True, env="CORS_ALLOW_CREDENTIALS")
    CORS_ALLOW_METHODS: list[str] = Field(default=["*"], env="CORS_ALLOW_METHODS")
    CORS_ALLOW_HEADERS: list[str] = Field(default=["*"], env="CORS_ALLOW_HEADERS")

    # ---- File Upload ----
    UPLOAD_DIR: str = Field(default="./uploads", env="UPLOAD_DIR")
    MAX_UPLOAD_SIZE: int = Field(default=10 * 1024 * 1024, env="MAX_UPLOAD_SIZE")  # 10MB
    ALLOWED_EXTENSIONS: list[str] = Field(
        default=[".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"],
        env="ALLOWED_EXTENSIONS",
    )

    # ---- Rate Limiting ----
    RATE_LIMIT_ENABLED: bool = Field(default=True, env="RATE_LIMIT_ENABLED")
    RATE_LIMIT_DEFAULT: str = Field(default="100/minute", env="RATE_LIMIT_DEFAULT")

    # ---- Logging ----
    LOG_LEVEL: str = Field(default="INFO", env="LOG_LEVEL")
    LOG_FILE: str = Field(default="logs/nird.log", env="LOG_FILE")

    # ---- Email (Optional) ----
    SMTP_HOST: Optional[str] = Field(default=None, env="SMTP_HOST")
    SMTP_PORT: Optional[int] = Field(default=587, env="SMTP_PORT")
    SMTP_USER: Optional[str] = Field(default=None, env="SMTP_USER")
    SMTP_PASSWORD: Optional[str] = Field(default=None, env="SMTP_PASSWORD")

    # ---- Feature Flags ----
    ENABLE_REGISTRATION: bool = Field(default=True, env="ENABLE_REGISTRATION")
    ENABLE_EMAIL_VERIFICATION: bool = Field(default=False, env="ENABLE_EMAIL_VERIFICATION")

    # ---- Validators ----
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        """
        Accept:
        - a JSON array string: '["https://a.com","https://b.com"]'
        - a comma-separated string: 'https://a.com, https://b.com'
        - a Python list[str]
        """
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                # JSON list
                import json
                return [s.strip() for s in json.loads(v)]
            # Comma-separated
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        allowed = {"development", "staging", "production", "testing"}
        if v not in allowed:
            raise ValueError(f"Environment must be one of {sorted(allowed)}")
        return v

    # ---- Convenience ----
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    # ---- Settings config (Pydantic v2) ----
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # Ignore unknown env vars rather than erroring
    )


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
