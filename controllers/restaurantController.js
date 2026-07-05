const RestaurantModel = require('../models/RestaurantModel');
const ReviewModel = require('../models/ReviewModel');

const getAll = async (req, res) => {
  const restaurants = await RestaurantModel.getAllWithRatings();
  res.json(restaurants);
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
  const restaurant = await RestaurantModel.create(name, cuisine, location, req.user.id);
  res.status(201).json(restaurant);
};

module.exports = { getAll, getById, create };
