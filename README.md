# NIRD Platform

> Plateforme "NIRD" (Numérique Inclusif, Responsable et Durable) — projet full‑stack réalisé pour La Nuit de l'Info 2025.

Ce dépôt contient une API backend en **FastAPI** (Python) et une application frontend en **React + TypeScript (Vite)**. L'architecture est conçue pour gérer des utilisateurs, des équipes, des missions gamifiées, un leaderboard en temps réel, un forum et des ressources.

## Fonctionnalités principales

- Authentification JWT (inscription, login, refresh)
- Gestion des utilisateurs et des écoles
- Gestion des équipes et des membres
- Missions (création, soumission, approbation)
- Badges et récompenses
- Leaderboard en temps réel (SSE)
- Forum et ressources partagées
- Notifications
- API d'administration (gestion des utilisateurs, approbation des soumissions)
- Migrations avec Alembic, stockage PostgreSQL

## Structure du dépôt

- `/backend` : API FastAPI
  - `app/` : routes, modèles SQLAlchemy, schémas Pydantic, services
  - `main.py` : point d'entrée (uvicorn) et configuration du lifespan
  - `requirements.txt` : dépendances Python
  - `alembic/` : migrations
  - `init.sql` : script d'initialisation pour PostgreSQL
  - `seed_data.py` : script d'injection de données de test
- `/frontend` : application React + TypeScript (Vite)
  - `src/` : pages, composants, services
  - `package.json` : scripts et dépendances
- `docker-compose.yml` : services PostgreSQL et pgAdmin

## Prérequis

- Git
- Docker & Docker Compose (pour la base de données et pgAdmin)
- Python 3.11+ (backend)
- Node.js 18+ / npm ou yarn (frontend)

## Installation et lancement — méthode recommandée (Docker pour DB)

1) Cloner le dépôt

```bash
git clone <repo-url> nird-platform
cd nird-platform
```

2) Démarrer PostgreSQL et pgAdmin via Docker Compose

```bash
docker-compose up -d
```

Le `docker-compose.yml` démarre :
- postgres:16-alpine (port 5432)
- pgAdmin (port 5050, login: `admin@nird.com` / `admin`)

3) Backend — installation et démarrage

```bash
cd backend
# optionnel : créer un virtualenv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
# copier l'exemple d'env si présent
cp .env.example .env || true
# adapter .env (DATABASE_URL, JWT_SECRET, etc.)

# appliquer les migrations
alembic upgrade head

# lancer en dev
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Endpoints utiles après démarrage:
- API: http://localhost:8000
- Docs interactives (Swagger UI): http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

4) Frontend — installation et démarrage

```bash
cd frontend
npm install
npm run dev
# par défaut Vite serve sur http://localhost:5173
```

5) Mode production (build frontend)

```bash
cd frontend
npm run build
# servir le contenu dist via un serveur statique (ou config dans backend si prévu)
```

## Variables d'environnement importantes (backend)

- DATABASE_URL — chaîne de connexion PostgreSQL
- JWT_SECRET_KEY — secret pour les tokens JWT
- UPLOAD_DIR — dossier pour les fichiers téléchargés (par défaut utilisé dans `main.py`)
- CORS_ORIGINS — origines autorisées

Consultez `.env.example` dans `/backend` (si présent) pour la liste complète.

## Scripts utiles

- Backend
  - `python main.py` ou `uvicorn main:app --reload` — lancer l'API
  - `alembic revision --autogenerate -m "msg"` — créer migration
  - `alembic upgrade head` — appliquer migrations
  - `pytest` — lancer tests (le code contient plusieurs tests unitaires)

- Frontend (dans `/frontend`)
  - `npm run dev` — démarrer en dev
  - `npm run build` — construire
  - `npm run preview` — preview du build
  - `npm run lint` — lint

## Tests

- Backend : tests unitaires et d'intégration (ex: `test_auth_api.py`, `test_mission_api.py`, etc.). Lancer depuis la racine ou `/backend` :

```bash
cd backend
pytest
```

- Frontend : pas de tests fournis dans le squelette ; utiliser `eslint` et ajouter `vitest` si nécessaire.

## Débogage / Vérifications

- Vérifier la santé de l'API : `GET /api/health`
- Vérifier la connexion DB : logs Docker Compose, pgAdmin ou via l'endpoint santé
- Uploads : `app.mount("/uploads", StaticFiles(...))` sert les fichiers téléchargés sous `/uploads`

## Sécurité et bonnes pratiques

- Ne comitez jamais vos secrets. Utilisez `.env` et ignorez-le dans `.gitignore`.
- Changez le mot de passe par défaut de la base de données lorsque vous déployez.
- Limitez les origines CORS en production.

## Données de test / Seed

Le backend contient `seed_data.py` pour peupler la base (utiles pour développement). Exécutez-le après avoir appliqué les migrations et configuré la DB.

## Problèmes connus / Notes

- Le frontend est un template Vite + React ; adaptez les routes et l'API client (`/frontend/src/lib/api-client.ts`) si l'URL du backend change.
- Le `docker-compose.yml` fourni démarre uniquement la DB et pgAdmin — le backend et le frontend restent à lancer localement (ou emballer dans d'autres services Docker si souhaité).

## Prochaines améliorations suggérées

1. Ajouter un `Makefile` ou scripts `./scripts/` pour automatiser setup (venv, migrations, seed, start)
2. CI : tests automatés (pytest + lint) et build frontend
3. Dockerfile et services docker-compose pour le backend et le frontend
4. Ajouter des tests end-to-end (Cypress / Playwright)

---

Si vous voulez, je peux :
- générer un `Makefile` et des scripts d'automatisation
- ajouter un `Dockerfile` pour le backend
- améliorer la documentation des variables `.env`

Fin de la synthèse — si vous souhaitez que j'adapte le README (plus de détails sur les endpoints, exemples d'usage JWT, scripts exacts d'env), dites-moi ce que vous voulez approfondir.
