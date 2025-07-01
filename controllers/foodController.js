const Food = require('../models/foodModel');
const APIFoodFeatures = require('../apis/apiFoodFeatures');

exports.getFoodStats = async (req, res) => {
  try {
    const stats = await Food.aggregate([
      {
        $group: {
          _id: '$category',
          numFoods: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: -1 }, // Sort by average price descending
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
}


exports.getAllFoods = async (req, res) => {
  try {
    // Execute the query
    const foodFeatures = new APIFoodFeatures(Food.find(), req.query).sort().filter().limitFields().paginate();
    const foods = await foodFeatures.query;

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
