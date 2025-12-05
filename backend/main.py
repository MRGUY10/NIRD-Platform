"""
NIRD Platform - Backend API
Numérique Inclusif, Responsable et Durable
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import configuration
from app.core.config import settings
from app.core.database import engine, init_db, Base

# Import all models to register them with SQLAlchemy
from app.models import (
    User, School, Team, TeamMember, Category, Mission, MissionSubmission,
    Badge, UserBadge, Resource, ForumPost, Comment, Notification, LeaderboardSnapshot
)

# Import API routers
from app.api import auth, teams, missions, leaderboard, resources, forum, stats, badges, notifications, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events
    """
    # Startup
    print("🚀 Starting NIRD Platform API...")
    print(f"📦 Environment: {settings.ENVIRONMENT}")
    print(f"🗄️  Database: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'Not configured'}")
    
    # Initialize database tables
    try:
        init_db()
        print("✅ Database tables initialized")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
    
    yield
    
    # Shutdown
    print("👋 Shutting down NIRD Platform API...")


app = FastAPI(
    title=settings.APP_NAME,
    description="API for the Numérique Inclusif, Responsable et Durable platform",
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """
    Root endpoint - Health check
    """
    return {
        "message": settings.APP_NAME,
        "status": "running",
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/api/docs"
    }


@app.get("/api/health")
async def health_check():
    """
    Health check endpoint with database status
    """
    from sqlalchemy import text
    
    db_status = "disconnected"
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
            db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "database": db_status,
        "environment": settings.ENVIRONMENT
    }


# Include API routers
app.include_router(auth.router, prefix="/api")
app.include_router(teams.router, prefix="/api/teams")
app.include_router(missions.router, prefix="/api/missions")
app.include_router(leaderboard.router, prefix="/api/leaderboard")
app.include_router(resources.router, prefix="/api/resources")
app.include_router(forum.router, prefix="/api/forum")
app.include_router(stats.router, prefix="/api/stats", tags=["Statistics"])
app.include_router(badges.router, prefix="/api/badges", tags=["Badges"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
