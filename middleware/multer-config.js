const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Dictionnaire des extensions possibles
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
  let title = 'image';
  try {
    
    if (req.body.book) {
      const bookData = JSON.parse(req.body.book);
      title = bookData.title ? bookData.title.trim().split(' ').join('_') : 'image';
    }
  } catch (error) {
    console.warn('⚠️ Impossible de lire req.body.book pour nommer l’image, utilisation du nom par défaut.');
  }

  const extension = MIME_TYPES[file.mimetype] || 'jpg';
  callback(null, `${title}_${Date.now()}.${extension}`);
}
});

const upload = multer({ storage });

// Middleware combiné : upload puis optimisation avec Sharp
const multerSharpMiddleware = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: 'Erreur Multer : ' + err.message });
    }

    if (!req.file) {
      return next(); // pas de fichier envoyé
    }

    const imagePath = path.join('images', req.file.filename);

    try {
      // Compression & redimensionnement
      await sharp(imagePath)
        .resize(206, 260, { fit: 'inside' }) // limite à 206x260px max
        .toFormat('webp')
        .webp({ quality: 80 }) // compression
        .toFile(imagePath + '.webp');

      // Supprimer l’image originale (non compressée)
      fs.unlinkSync(imagePath);

      // Mettre à jour les infos du fichier pour la suite
      req.file.filename = req.file.filename + '.webp';
      req.file.path = imagePath + '.webp';
      next();
    } catch (error) {
      console.error('Erreur Sharp :', error);
      res.status(500).json({ error: 'Erreur de compression de l’image' });
    }
  });
};

// Export du middleware
module.exports = multer({ storage }).single('image');