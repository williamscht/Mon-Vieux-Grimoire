const Books = require('../models/Books');
const fs = require('fs');

// CREATE — POST /api/books
exports.createBook = (req, res) => {
   
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
        .then(() => {
          Books.findOne({ _id: req.params.id }) 
            .then((updatedBook) => res.status(200).json(updatedBook));
        })
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



// Attribution d'une note à un livre 
exports.rateBook = async (req, res) => {
  const userId = req.auth.userId;
  const rating = Number(req.body.rating);

  if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
    return res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
  }

  try {
    const book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé.' });
    }

    // Vérifie si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    // Si le livre n’a pas de notes cohérentes (comme dans data.json)
    if ((!book.ratings || book.ratings.length === 0) && book.averageRating) {
      // On transforme la moyenne initiale en une note "fictive"
      book.ratings.push({ userId: 'system', grade: book.averageRating });
    }

    // Ajoute la note réelle de l’utilisateur
    book.ratings.push({ userId, grade: rating });

    // Recalcule de la moyenne réelle
    const total = book.ratings.reduce((sum, r) => sum + Number(r.grade || 0), 0);
    book.averageRating = parseFloat((total / book.ratings.length).toFixed(1));

    const updatedBook = await book.save();
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getBestRatedBooks = async (req, res) => {
  try {
    // Récupère tous les livres
    const books = await Books.find();

    // Trie par note moyenne décroissante et limite à 3
    const bestRated = books
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 3);

    res.status(200).json(bestRated);
  } catch (error) {
    res.status(400).json({ error });
  }
};