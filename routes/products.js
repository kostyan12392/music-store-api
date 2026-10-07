const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Публичные — любой может смотреть каталог
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Только для админов
router.post('/', authenticate, isAdmin, controller.create);
router.put('/:id', authenticate, isAdmin, controller.update);
router.delete('/:id', authenticate, isAdmin, controller.remove);

module.exports = router;