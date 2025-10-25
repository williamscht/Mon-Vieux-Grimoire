const Books = require('../models/Books');
const fs = require('fs');

// CREATE — POST /api/books
exports.createBook = (req, res) => {
    console.log("📥 Fichier reçu :", req.file);
    console.log("📦 Corps de la requête :", req.body);
  try {
    const bookObject = JSON.parse(req.body.book); 
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Books({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Livre ajouté avec image !' }))
      .catch(error => res.status(400).json({ error }));
  } catch (error) {
    res.status(500).json({ error: 'Erreur interne lors de la création du livre' });
  }
};

// READ ONE — GET /api/books/:id
exports.getOneBook = (req, res) => {
  Books.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// UPDATE — PUT /api/books/:id
exports.modifyBook = (req, res) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      }
    : { ...req.body };

  delete bookObject._userId;

  Books.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      if (book.userId.toString() !== req.auth.userId) {
        return res.status(403).json({ message: 'Action non autorisée' });
      }

      Books.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Livre modifié avec succès !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// DELETE — DELETE /api/books/:id
exports.deleteBook = (req, res) => {
  Books.findOne({ _id: req.params.id })
    .then(book => {
      if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
      }
      if (book.userId.toString() !== req.auth.userId) {
        return res.status(403).json({ message: 'Action non autorisée' });
      }

      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Books.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Livre et image supprimés avec succès !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// READ ALL — GET /api/books
exports.getAllBooks = (req, res) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};