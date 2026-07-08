const RestaurantModel = require('../models/RestaurantModel');
const ReviewModel = require('../models/ReviewModel');

const getAll = async (req, res) => {
  const { cuisine, location, sort, page, limit } = req.query;
  const [restaurants, total] = await Promise.all([
    RestaurantModel.getAllWithRatings({ cuisine, location, sort, page, limit }),
    RestaurantModel.countAll({ cuisine, location }),
  ]);
  res.json({
    restaurants,
    total,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });
};

const getById = async (req, res) => {
  const restaurant = await RestaurantModel.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  const reviews = await ReviewModel.findByRestaurantId(req.params.id);
  res.json({ restaurant, reviews });
};

const create = async (req, res) => {
  const { name, cuisine, location } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const restaurant = await RestaurantModel.create(name, cuisine, location, req.user.id, imageUrl);
  res.status(201).json(restaurant);
};

const remove = async (req, res) => {
  const restaurant = await RestaurantModel.findById(req.params.id);
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  await RestaurantModel.remove(req.params.id);
  res.status(204).send();
};

module.exports = { getAll, getById, create, remove };
