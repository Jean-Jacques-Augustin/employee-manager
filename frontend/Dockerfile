# Utiliser l'image de Node.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Builder l'application
RUN npm run build

# Exposer le port utilisé par le frontend
EXPOSE 5173

# Lancer l'application
CMD ["npm", "run", "start"]