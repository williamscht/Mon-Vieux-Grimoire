const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Import des routeurs
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connexion MongoDB réussie !'))
  .catch((error) => console.log('❌ Connexion MongoDB échouée :', error));

// Enregistrement des routeurs
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('🚀 Serveur Mon Vieux Grimoire connecté à MongoDB !');
});

module.exports = app;