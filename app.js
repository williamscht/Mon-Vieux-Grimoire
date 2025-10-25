const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const Books = require('./models/Books');

const app = express();

// Import du routeur des livres
const bookRoutes = require('./routes/books');

console.log('📂 Type de bookRoutes :', typeof bookRoutes, bookRoutes);

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


//Connexion à MDB//
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connexion MongoDB réussie !'))
  .catch((error) => console.log('❌ Connexion MongoDB échouée :', error)); 
  


// Enregistrement du routeur
app.use('/api/books', bookRoutes);


//Connexion Test//
app.get('/', (req, res) => {
  res.send('🚀 Serveur Mon Vieux Grimoire connecté à MongoDB !');
});



module.exports = app;
