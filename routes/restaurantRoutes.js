const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/', restaurantController.getAll);
router.get('/:id', restaurantController.getById);
router.post('/', requireAuth, restaurantController.create);

module.exports = router;
