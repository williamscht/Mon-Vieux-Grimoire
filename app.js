const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


const Books = require('./models/Books');

const app = express();

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






//Connexion à MDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connexion MongoDB réussie !'))
  .catch((error) => console.log('❌ Connexion MongoDB échouée :', error));


//CRUD

//Creat - POST /api/books
app.post('/api/books', (req, res) => {
  const book = new Books({
    ...req.body
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre ajouté dans MongoDB !' }))
    .catch(error => res.status(400).json({ error }));
});

//Read — GET /api/books
app.get('/api/books', (req, res) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

//Read (id) — GET /api/books/:id
app.get('/api/books/:id', (req, res) => {
  Books.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});

//UPDATE — PUT /api/books/:id
app.put('/api/books/:id', (req, res) => {
  Books.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
    .catch(error => res.status(400).json({ error }));
});

//DELETE — DELETE /api/books/:id
app.delete('/api/books/:id', (req, res) => {
  Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé avec succès !' }))
    .catch(error => res.status(400).json({ error }));
});


//Connexion Test
app.get('/', (req, res) => {
  res.send('🚀 Serveur Mon Vieux Grimoire connecté à MongoDB !');
});



module.exports = app;
