const express = require('express');
const router = express.Router();
//const controller = require('../controllers/productsController');
const controller = require('../controllers/productsMongoController'); // Стало для MongoDB
const { authenticate, isAdmin } = require('../middleware/auth');

// Публичные — любой может смотреть каталог
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Только для админов
router.post('/', authenticate, isAdmin, controller.create);
router.put('/:id', authenticate, isAdmin, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.remove);


router.post('/:id/reviews', authenticate, controller.addReview);
router.patch('/:id/stock', authenticate, isAdmin, controller.updateStock);

module.exports = router;