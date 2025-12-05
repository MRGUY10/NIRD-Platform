# 🚀 Guide de Déploiement sur Render

Ce guide vous explique comment déployer NIRD Platform sur Render (backend et frontend).

## 📋 Prérequis

1. Un compte Render (gratuit) : https://render.com
2. Un compte GitHub avec votre projet poussé
3. Une base de données PostgreSQL (Render offre un plan gratuit)

---

## 🗄️ ÉTAPE 1 : Déployer la Base de Données PostgreSQL

### 1.1 Créer une base de données PostgreSQL

1. Connectez-vous à [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur **"New +"** → **"PostgreSQL"**
3. Configurez :
   - **Name** : `nird-database`
   - **Database** : `nird_db`
   - **User** : `nird_user` (ou laissez par défaut)
   - **Region** : Choisissez la région la plus proche
   - **PostgreSQL Version** : 16 (ou la plus récente)
   - **Instance Type** : Free (pour commencer)
4. Cliquez sur **"Create Database"**

### 1.2 Récupérer les informations de connexion

Une fois créée, notez :
- **Internal Database URL** (pour le backend)
- **External Database URL** (pour les connexions externes)
- **Host**, **Port**, **Database**, **Username**, **Password**

---

## 🔧 ÉTAPE 2 : Préparer le Backend pour le Déploiement

### 2.1 Créer un fichier `render.yaml` (optionnel mais recommandé)

Créez `render.yaml` à la racine du projet :

```yaml
services:
  # Backend API
  - type: web
    name: nird-backend
    env: python
    region: oregon
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: nird-database
          property: connectionString
      - key: SECRET_KEY
        generateValue: true
      - key: ALGORITHM
        value: HS256
      - key: ACCESS_TOKEN_EXPIRE_MINUTES
        value: 30
      - key: REFRESH_TOKEN_EXPIRE_DAYS
        value: 7
      - key: ENVIRONMENT
        value: production

  # Frontend
  - type: web
    name: nird-frontend
    env: static
    region: oregon
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: nird-database
    databaseName: nird_db
    user: nird_user
    region: oregon
```

### 2.2 Modifier `backend/main.py` pour la production

Ajoutez la configuration CORS pour le domaine Render :

```python
from fastapi.middleware.cors import CORSMiddleware
import os

# ... votre code existant ...

# Configuration CORS pour la production
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://nird-frontend.onrender.com",  # Remplacez par votre URL frontend
    os.getenv("FRONTEND_URL", ""),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2.3 Vérifier `backend/requirements.txt`

Assurez-vous que tous les packages nécessaires sont listés :

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
psycopg2-binary==2.9.9
alembic==1.13.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.3
pydantic-settings==2.1.0
python-dotenv==1.0.0
```

### 2.4 Créer `backend/alembic.ini` pour la production

Si vous utilisez Alembic, modifiez `alembic.ini` pour utiliser la variable d'environnement :

```ini
[alembic]
script_location = alembic
sqlalchemy.url = 
# L'URL sera définie par la variable d'environnement DATABASE_URL
```

Et dans `backend/alembic/env.py` :

```python
import os
from sqlalchemy import engine_from_config, pool

config.set_main_option('sqlalchemy.url', os.getenv('DATABASE_URL'))
```

---

## 🖥️ ÉTAPE 3 : Déployer le Backend

### 3.1 Déploiement manuel via Dashboard

1. Dans Render Dashboard, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub
3. Configurez :
   - **Name** : `nird-backend`
   - **Region** : Même région que votre BDD
   - **Branch** : `main` ou `stim`
   - **Root Directory** : `backend`
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3.2 Configurer les variables d'environnement

Dans l'onglet **"Environment"**, ajoutez :

| Key | Value |
|-----|-------|
| `DATABASE_URL` | URL interne de votre BDD PostgreSQL |
| `SECRET_KEY` | Générez une clé secrète forte (voir ci-dessous) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` |
| `ENVIRONMENT` | `production` |
| `FRONTEND_URL` | URL de votre frontend (à définir après) |

**Générer une SECRET_KEY** :
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3.3 Exécuter les migrations

Une fois déployé, ouvrez le **Shell** dans Render et exécutez :

```bash
cd backend
alembic upgrade head
python seed_data.py  # Si vous avez des données de démarrage
```

### 3.4 Tester l'API

Votre API sera disponible à : `https://nird-backend.onrender.com`

Testez : `https://nird-backend.onrender.com/docs`

---

## 🎨 ÉTAPE 4 : Préparer le Frontend pour le Déploiement

### 4.1 Mettre à jour l'URL de l'API

Modifiez `frontend/src/lib/api-client.ts` :

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://nird-backend.onrender.com/api'  // URL de votre backend
    : 'http://localhost:8000/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
```

### 4.2 Créer `.env.production` dans le dossier frontend

```env
VITE_API_URL=https://nird-backend.onrender.com/api
```

### 4.3 Vérifier `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

---

## 🌐 ÉTAPE 5 : Déployer le Frontend

### 5.1 Déploiement via Dashboard

1. Dans Render Dashboard, cliquez sur **"New +"** → **"Static Site"**
2. Connectez votre dépôt GitHub
3. Configurez :
   - **Name** : `nird-frontend`
   - **Branch** : `main` ou `stim`
   - **Root Directory** : `frontend`
   - **Build Command** : `npm install && npm run build`
   - **Publish Directory** : `dist`

### 5.2 Configurer les variables d'environnement

Dans l'onglet **"Environment"**, ajoutez :

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://nird-backend.onrender.com/api` |

### 5.3 Configurer les redirections (SPA)

Créez `frontend/public/_redirects` :

```
/*    /index.html   200
```

Ou créez `frontend/render.yaml` :

```yaml
services:
  - type: web
    name: nird-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 🔄 ÉTAPE 6 : Mise à jour du Backend avec l'URL du Frontend

1. Retournez dans les paramètres de **nird-backend**
2. Mettez à jour la variable d'environnement `FRONTEND_URL` avec l'URL du frontend
3. Redémarrez le backend

---

## ✅ ÉTAPE 7 : Vérification et Tests

### 7.1 Vérifier les services

- ✅ Backend API : `https://nird-backend.onrender.com/docs`
- ✅ Frontend : `https://nird-frontend.onrender.com`

### 7.2 Tester les fonctionnalités

1. Inscription d'un nouvel utilisateur
2. Connexion
3. Navigation entre les pages
4. Création d'une équipe
5. Soumission de mission
6. Consultation du classement

### 7.3 Vérifier les logs

En cas d'erreur, consultez les logs dans Render Dashboard → Service → Logs

---

## 🔧 ÉTAPE 8 : Configuration Avancée (Optionnel)

### 8.1 Domaine personnalisé

1. Dans Render Dashboard → Service → Settings
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

### 8.2 HTTPS automatique

Render fournit automatiquement des certificats SSL via Let's Encrypt.

### 8.3 Auto-déploiement

Render déploie automatiquement à chaque push sur la branche configurée.

### 8.4 Surveillance et alertes

- Configurez les **Health Checks**
- Activez les **notifications** par email
- Consultez les **métriques** de performance

---

## 🐛 Dépannage

### Erreur : "Application failed to respond"

- Vérifiez que le port utilisé est `$PORT` (fourni par Render)
- Vérifiez les logs du service

### Erreur de connexion à la base de données

- Vérifiez que `DATABASE_URL` est correctement configuré
- Utilisez l'**Internal Database URL** (pas External)
- Vérifiez que les migrations sont exécutées

### Erreur CORS

- Vérifiez que l'URL du frontend est dans la liste `origins`
- Vérifiez que `FRONTEND_URL` est configuré

### Build frontend échoue

- Vérifiez `package.json` et les dépendances
- Assurez-vous que `npm run build` fonctionne localement
- Vérifiez les variables d'environnement

### Service en "Suspended" (plan gratuit)

Render suspend les services gratuits après 15 minutes d'inactivité. Le premier accès prendra ~30 secondes.

---

## 💰 Plans et Coûts

### Plan Gratuit (limites)
- **Web Services** : Suspension après 15 min d'inactivité, 750h/mois
- **PostgreSQL** : 1 GB stockage, expire après 90 jours
- **Static Sites** : 100 GB bande passante/mois

### Plans Payants (recommandé pour production)
- **Starter** : $7/mois - Pas de suspension
- **Standard** : $25/mois - Plus de ressources
- **PostgreSQL** : À partir de $7/mois

---

## 📚 Ressources Supplémentaires

- [Documentation Render](https://render.com/docs)
- [Guide FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Guide Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Guide PostgreSQL Render](https://render.com/docs/databases)

---

## 🎉 Félicitations !

Votre application NIRD Platform est maintenant déployée sur Render ! 🚀

**URLs de production :**
- Frontend : `https://nird-frontend.onrender.com`
- Backend API : `https://nird-backend.onrender.com`
- Documentation API : `https://nird-backend.onrender.com/docs`

---

## 📝 Checklist de déploiement

- [ ] Base de données PostgreSQL créée
- [ ] Variables d'environnement backend configurées
- [ ] Migrations de base de données exécutées
- [ ] Backend déployé et accessible
- [ ] Frontend configuré avec l'URL du backend
- [ ] Frontend déployé et accessible
- [ ] CORS configuré correctement
- [ ] Tests de toutes les fonctionnalités
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] Monitoring et alertes activés

**Bon déploiement ! 🎊**
