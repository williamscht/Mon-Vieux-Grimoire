const mongoose = require('mongoose');

const booksSchema = new mongoose.Schema({
  // Identifiant de l'utilisateur ayant ajouté le livre
  userId: { type: String, required: true },

  // Informations générales sur le livre
  title: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },

  // Tableau de notes
  ratings: [
    {
      userId: { type: String, required: true },
      grade: { type: Number, required: true },
    },
  ],

  // Note moyenne
  averageRating: { type: Number, required: true },
});

module.exports = mongoose.model('Books', booksSchema);
