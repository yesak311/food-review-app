const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validateReview } = require('../middleware/validators');

router.put('/:id', requireAuth, validateReview, reviewController.update);
router.delete('/:id', requireAuth, reviewController.remove);

module.exports = router;
