const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const reviewController = require('../controllers/reviewController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { validateReview, validateRestaurant } = require('../middleware/validators');
const upload = require('../middleware/upload');

router.get('/', restaurantController.getAll);
router.get('/:id', restaurantController.getById);
router.post('/', requireAuth, upload.single('photo'), validateRestaurant, restaurantController.create);
router.delete('/:id', requireAuth, requireAdmin, restaurantController.remove);
router.post('/:id/reviews', requireAuth, validateReview, reviewController.create);

module.exports = router;
