# Projet GESTION DES EMPLOYÉS - TEST DÉVELOPPEUR - ADM VALUE

Ce projet est une application full-stack conçue pour la gestion des employés. Il utilise **Next.js** pour le frontend, **Spring Boot** pour le backend, et **Docker Compose** pour orchestrer les conteneurs.

---

## 🏗️ Structure du Projet

Le projet est divisé en deux parties principales :
- **Frontend** : Développé avec **Next.js** et **React**.
- **Backend** : Développé avec **Spring Boot** en Java.

Chaque partie est conteneurisée pour un déploiement facile et reproductible.

---

## 🚀 Technologies Utilisées

### Frontend
- **Framework** : Next.js
- **Librarie principale** : React
- **Styling** : CSS ou Tailwind (selon les besoins)

### Backend
- **Framework** : Spring Boot (Java)
- **Sécurité** : Spring Security
- **Base de données** : PostgreSQL
- **ORM** : Hibernate

### Infrastructure
- **Conteneurisation** : Docker, Docker Compose

---

## 🛠️ Fonctionnalités

### 1. **Inscription et Authentification**
- **Inscription** :
  - Formulaire permettant aux utilisateurs de s’inscrire avec :
    - Un email comme nom d’utilisateur (validation pour garantir que l’email est valide).
    - Un mot de passe sécurisé respectant des règles strictes (longueur minimale, caractères spéciaux, majuscules, etc.).
- **Authentification** :
  - Les utilisateurs enregistrés peuvent se connecter pour accéder aux routes protégées.
- **Sécurité** :
  - Implémentée avec **Spring Security**.
  - Les routes protégées ne sont accessibles qu’aux utilisateurs authentifiés.

### 2. **Gestion des Employés (CRUD)**
Les utilisateurs authentifiés peuvent :
- **Ajouter un employé** :
  - Validation pour s’assurer qu’il n’y a pas de doublons sur le nom.
- **Lister les employés** :
  - Affiche le nom et la date de naissance des employés existants.
- **Mettre à jour les informations d’un employé**.
- **Supprimer un employé**.

---

## 🛠️ Prise en Main

### 📋 Prérequis
Assurez-vous d'avoir installé les outils suivants sur votre machine :
- **Node.js** (version 16 ou supérieure)
- **Java JDK** (version 17 ou supérieure)
- **Docker** et **Docker Compose**

---

### 🏃‍♂️ Installation et Lancement

#### Étape 1 : Cloner le dépôt
```bash
git clone https://github.com/Jean-Jacques-Augustin/employee-manager.git

cd employee-manager
```

#### Étape 2 : Démarrer avec Docker Compose
Pour démarrer tous les services (frontend, backend, et base de données), exécutez :
```bash
docker-compose up --build
```
Cela construira et démarrera les conteneurs Docker.

---

## 📂 Parcourir la Structure du Projet

### 📁 Frontend
Le dossier `frontend` contient le code source de l'application Next.js.

Pour démarrer le serveur de développement localement :
```bash
cd frontend
npm install
npm run dev
```
L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173).

---

### 📁 Backend
Le dossier `backend` contient le code source de l'application Spring Boot.

Pour démarrer l'application localement :
```bash
cd backend
./mvnw spring-boot:run
```
Le backend sera accessible à l'adresse [http://localhost:8080](http://localhost:8080).

---

## 🔄 Fonctionnement du Projet

### Architecture
1. **Frontend** :
   - Fournit une interface utilisateur interactive.
   - Consomme les API REST fournies par le backend.

2. **Backend** :
   - Gère la logique métier, les opérations CRUD et l’authentification.
   - Sécurise les endpoints avec **Spring Security**.

3. **Base de données** :
   - Stocke les informations des utilisateurs et des employés.
   - Fonctionne en tant que conteneur PostgreSQL intégré.

---

## 🔑 Gestion de la Sécurité avec Spring Security

- **Endpoints protégés** :
  - Les routes CRUD des employés sont accessibles uniquement aux utilisateurs authentifiés.
- **Cryptage des mots de passe** :
  - Les mots de passe des utilisateurs sont stockés dans la base de données avec un cryptage BCrypt.
- **Configuration des rôles** :
  - Les utilisateurs peuvent être configurés avec des rôles pour gérer les permissions.

---

## 🐳 Lancement avec Docker Compose

Docker Compose est utilisé pour orchestrer les services. En une seule commande, vous pouvez lancer l'application complète (frontend, backend, et base de données) :

```bash
docker-compose up --build
```

### Ports Utilisés
- **Frontend** : [http://localhost:5173](http://localhost:5173)
- **Backend** : [http://localhost:8080](http://localhost:8080)
- **PostgreSQL** : Port interne `5432`