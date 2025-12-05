# NIRD Platform Backend

Backend API for the **NIRD (Numérique Inclusif, Responsable et Durable)** platform - Built for La Nuit de l'Info 2025.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL (via Docker)

### Setup Instructions

1. **Clone and navigate to backend directory**
```powershell
cd backend
```

2. **Create virtual environment**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. **Install dependencies**
```powershell
pip install -r requirements.txt
```

4. **Configure environment**
```powershell
cp .env.example .env
# Edit .env with your configuration
```

5. **Start PostgreSQL with Docker**
```powershell
cd ..
docker-compose up -d postgres
```

6. **Run database migrations**
```powershell
cd backend
alembic upgrade head
```

7. **Start the development server**
```powershell
python main.py
# Or use: uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

8. **Access the API**
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
- PgAdmin: http://localhost:5050 (admin@nird.com / admin)

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/              # API route handlers
│   ├── core/             # Core configuration (database, security, config)
│   ├── models/           # SQLAlchemy database models
│   ├── schemas/          # Pydantic schemas for request/response
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── alembic/              # Database migrations
├── tests/                # Test suite
├── uploads/              # File uploads directory
├── main.py               # Application entry point
├── requirements.txt      # Python dependencies
└── .env                  # Environment configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh access token

### Teams
- `GET /api/teams` - List all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/{id}` - Get team details
- `PUT /api/teams/{id}` - Update team
- `DELETE /api/teams/{id}` - Delete team

### Missions
- `GET /api/missions` - List all missions
- `POST /api/missions` - Create mission (admin only)
- `POST /api/missions/{id}/submit` - Submit mission completion
- `PUT /api/missions/submissions/{id}/approve` - Approve submission (admin)

### Leaderboard (Real-time)
- `GET /api/leaderboard` - Get current rankings
- `GET /api/leaderboard/stream` - SSE endpoint for real-time updates
- `GET /api/leaderboard/team/{id}/history` - Team ranking history

### Statistics
- `GET /api/stats/global` - Global community statistics
- `GET /api/stats/team/{id}` - Team analytics

### Admin
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/users` - Manage users
- `GET /api/admin/submissions` - Pending mission approvals

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts and authentication
- **teams** - Team information
- **team_members** - Team membership (many-to-many)
- **schools** - School directory
- **missions** - Available missions
- **mission_submissions** - Completed missions with proofs
- **categories** - Mission categories
- **badges** - Achievement definitions
- **leaderboard_snapshots** - Historical rankings

## 🔧 Development

### Database Migrations
```powershell
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

### Running Tests
```powershell
pytest
pytest --cov=app tests/
```

### Code Style
```powershell
# Format code
black app/
# Check linting
flake8 app/
```

## 🐳 Docker

### Start all services
```powershell
docker-compose up -d
```

### View logs
```powershell
docker-compose logs -f postgres
```

### Stop services
```powershell
docker-compose down
```

### Reset database
```powershell
docker-compose down -v
docker-compose up -d postgres
```

## 📝 Environment Variables

See `.env.example` for all available configuration options:
- Database connection
- JWT secret and expiration
- CORS origins
- File upload settings
- Email configuration (optional)

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)
- Rate limiting (optional)

## 🎯 Hackathon Deliverables

✅ Full-stack REST API with FastAPI
✅ Real-time leaderboard with SSE
✅ PostgreSQL database with proper schema
✅ JWT authentication & authorization
✅ WCAG-compliant design considerations
✅ Complete documentation
✅ Docker setup for easy deployment

## 📚 Technologies Used

- **FastAPI** - Modern, fast web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **Pydantic** - Data validation
- **Alembic** - Database migrations
- **JWT** - Authentication tokens
- **Uvicorn** - ASGI server

## 👥 Team

Built with ❤️ for La Nuit de l'Info 2025

## 📄 License

Open source under libre license (as per hackathon requirements)
