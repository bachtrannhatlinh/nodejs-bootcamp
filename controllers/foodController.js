const Food = require('../models/foodModel');

exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json({
      status: 'success',
      results: foods.length,
      data: {
        foods,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ status: 'fail', message: 'Food not found' });
    }
    res.status(200).json({ status: 'success', data: { food } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!food) {
      return res.status(404).json({ status: 'fail', message: 'Food not found' });
    }
    res.status(200).json({ status: 'success', data: { food } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ status: 'fail', message: 'Food not found' });
    }
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createFood = async (req, res) => {
  try {
    const food = await Food.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        food,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};
