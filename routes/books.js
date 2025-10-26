const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookCtrl = require('../controllers/books');


router.get('/bestrating', bookCtrl.getBestRatedBooks);

// Route publique
router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);

// CRUD avec auth
router.post('/', auth, multer, bookCtrl.createBook);
router.put('/:id', auth, multer, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);


module.exports = router;