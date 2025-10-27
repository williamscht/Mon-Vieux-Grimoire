# Mon Vieux Grimoire - Backend

## Description

Ce projet est la partie backend de l’application Mon Vieux Grimoire, développée dans le cadre de la formation Développeur Web OpenClassrooms.

Il s’agit d’une API REST construite avec Node.js, Express et MongoDB, permettant la gestion des livres, l’authentification sécurisée des utilisateurs et la gestion des images.

## Fonctionnalités
	•	Création, lecture, modification et suppression de livres
	•	Téléversement et optimisation des images avec Multer et Sharp
	•	Authentification sécurisée avec bcrypt et JWT
	•	Calcul automatique de la moyenne des notes des livres
	•	Tri des livres par meilleure note

## Technologies
Node.js
Express
MongoDB / Mongoose
Multer / Sharp
bcrypt / JWT

## Comment lancer le projet

### Avec npm

Cloner le dépôt
git clone https://github.com/williamscht/Mon-Vieux-Grimoire

Installer les dépendances
npm install

Créer un fichier .env à la racine avec les variables suivantes :
MONGO_URI=<votre_uri_mongodb>
PORT=4000
JWT_SECRET=RANDOM_SECRET_KEY


Lancer le serveur
npm start

ou en mode développement
npm run dev

Le projet a été testé sur Node 19 et MongoDB Atlas.

## Auteur

Projet réalisé par William Schmitt dans le cadre du parcours Développeur Web - OpenClassrooms.