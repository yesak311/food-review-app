const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateReview } = require('../middleware/validators');

router.get('/', restaurantController.getAll);
router.get('/:id', restaurantController.getById);
router.post('/', requireAuth, restaurantController.create);
router.post('/:id/reviews', requireAuth, validateReview, reviewController.create);

module.exports = router;
