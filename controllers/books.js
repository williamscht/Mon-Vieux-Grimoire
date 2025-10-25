const Books = require('../models/Books');

// CREATE — POST /api/books
exports.createBook = (req, res) => {
  const book = new Books({
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: req.body.ratings,
    averageRating: req.body.averageRating
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Livre ajouté dans MongoDB !' }))
    .catch(error => res.status(400).json({ error }));
};

// READ ONE — GET /api/books/:id
exports.getOneBook = (req, res) => {
  Books.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

// UPDATE — PUT /api/books/:id
exports.modifyBook = (req, res) => {
  const book = {
    _id: req.params.id,
    userId: req.body.userId,
    title: req.body.title,
    author: req.body.author,
    imageUrl: req.body.imageUrl,
    year: req.body.year,
    genre: req.body.genre,
    ratings: req.body.ratings,
    averageRating: req.body.averageRating
  };

  Books.updateOne({ _id: req.params.id }, book)
    .then(() => res.status(201).json({ message: 'Livre mis à jour avec succès !' }))
    .catch(error => res.status(400).json({ error }));
};

// DELETE — DELETE /api/books/:id
exports.deleteBook = (req, res) => {
  Books.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé avec succès !' }))
    .catch(error => res.status(400).json({ error }));
};

// READ ALL — GET /api/books
exports.getAllBooks = (req, res) => {
  Books.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};