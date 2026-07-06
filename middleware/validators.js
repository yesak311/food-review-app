const { body, validationResult } = require('express-validator');

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const validateRegister = [
  body('username').trim().isLength({ min: 3, max: 255 }),
  body('password').isLength({ min: 8 }),
  handleValidation,
];

const validateReview = [
  body('title').trim().isLength({ min: 1, max: 255 }),
  body('content').trim().notEmpty(),
  body('rating').isInt({ min: 1, max: 5 }),
  handleValidation,
];

module.exports = { validateRegister, validateReview };
