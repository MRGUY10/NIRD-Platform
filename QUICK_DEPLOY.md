# 🚀 Quick Deploy Script for NIRD Platform on Render

## Instructions rapides

### 1. Préparation du dépôt GitHub

```bash
# Assurez-vous que tous les fichiers sont commités
git add .
git commit -m "Prêt pour le déploiement sur Render"
git push origin main
```

### 2. Créer la base de données PostgreSQL sur Render

1. Allez sur https://dashboard.render.com
2. Cliquez sur **New +** → **PostgreSQL**
3. Configurez:
   - Name: `nird-database`
   - Database: `nird_db`
   - User: `nird_user`
   - Plan: Free
4. Créez et copiez l'**Internal Database URL**

### 3. Déployer le Backend

**Option A: Utiliser render.yaml (automatique)**
1. Dans Render Dashboard, cliquez sur **New +** → **Blueprint**
2. Connectez votre repo GitHub
3. Render détectera automatiquement le fichier `render.yaml`
4. Suivez les instructions

**Option B: Manuel**
1. **New +** → **Web Service**
2. Configurez:
   ```
   Name: nird-backend
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```
3. Ajoutez les variables d'environnement:
   ```
   DATABASE_URL=<votre-internal-database-url>
   SECRET_KEY=<générez une clé avec: python -c "import secrets; print(secrets.token_urlsafe(32))">
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend.onrender.com
   ```

### 4. Exécuter les migrations

Une fois le backend déployé:
1. Allez dans le service backend sur Render
2. Ouvrez le **Shell** (onglet)
3. Exécutez:
   ```bash
   cd backend
   alembic upgrade head
   python seed_data.py  # Si vous avez des données initiales
   ```

### 5. Déployer le Frontend

1. **New +** → **Static Site**
2. Configurez:
   ```
   Name: nird-frontend
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```
3. Ajoutez la variable d'environnement:
   ```
   VITE_API_URL=https://nird-backend.onrender.com/api
   ```
4. Créez un fichier `frontend/public/_redirects` (déjà fait):
   ```
   /*    /index.html   200
   ```

### 6. Mettre à jour CORS dans le Backend

1. Retournez dans le service backend
2. Mettez à jour la variable `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=http://localhost:5173,https://nird-frontend.onrender.com
   ```
3. Redéployez le service

### 7. Tester

- Backend API: https://nird-backend.onrender.com/api/docs
- Frontend: https://nird-frontend.onrender.com
- Health Check: https://nird-backend.onrender.com/api/health

---

## Commandes utiles

### Générer une SECRET_KEY
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Tester l'API localement avant déploiement
```bash
cd backend
source venv/bin/activate
DATABASE_URL=<your-render-db-url> uvicorn main:app --reload
```

### Build frontend localement
```bash
cd frontend
npm install
VITE_API_URL=https://nird-backend.onrender.com/api npm run build
```

---

## Troubleshooting

### Backend ne démarre pas
- Vérifiez les logs dans Render Dashboard
- Assurez-vous que DATABASE_URL est correct
- Vérifiez que toutes les dépendances sont dans requirements.txt

### Frontend ne se connecte pas au backend
- Vérifiez que VITE_API_URL est correct
- Vérifiez les CORS_ORIGINS dans le backend
- Ouvrez la console du navigateur pour voir les erreurs

### Base de données vide
- Exécutez `alembic upgrade head` dans le Shell du backend
- Exécutez `python seed_data.py` pour les données initiales

### Service en "Suspended" (Plan gratuit)
- Normal après 15 minutes d'inactivité
- Le premier accès prendra ~30 secondes

---

## URLs importantes

Une fois déployé, vos URLs seront:
- **Backend**: https://nird-backend.onrender.com
- **Frontend**: https://nird-frontend.onrender.com
- **API Docs**: https://nird-backend.onrender.com/api/docs
- **Health**: https://nird-backend.onrender.com/api/health

---

## Checklist finale

- [ ] Code pushé sur GitHub
- [ ] Base de données PostgreSQL créée
- [ ] Backend déployé avec les bonnes variables d'environnement
- [ ] Migrations exécutées
- [ ] Frontend déployé avec VITE_API_URL correct
- [ ] CORS configuré pour le domaine frontend
- [ ] Test de connexion/inscription fonctionne
- [ ] Test de navigation dans l'application

**C'est parti ! 🎉**
