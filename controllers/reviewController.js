const ReviewModel = require('../models/ReviewModel');

const create = async (req, res) => {
  const { title, content, rating } = req.body;
  try {
    const review = await ReviewModel.create(req.params.id, req.user.id, title, content, rating);
    res.status(201).json(review);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'You have already reviewed this restaurant' });
    }
    throw err;
  }
};

const update = async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only modify your own reviews' });
  }

  const { title, content, rating } = req.body;
  const updated = await ReviewModel.update(req.params.id, title, content, rating);
  res.json(updated);
};

const remove = async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only modify your own reviews' });
  }

  await ReviewModel.remove(req.params.id);
  res.status(204).send();
};

module.exports = { create, update, remove };
