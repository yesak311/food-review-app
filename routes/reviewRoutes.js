const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { requireAuth } = require('../middleware/authMiddleware');

router.put('/:id', requireAuth, reviewController.update);
router.delete('/:id', requireAuth, reviewController.remove);

module.exports = router;
