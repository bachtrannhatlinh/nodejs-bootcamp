const Food = require('../models/foodModel');

exports.getAllFoods = async (req, res) => {
  try {
    // a1. Filtering - Remove special fields
    const queryObj = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // a2. Advanced Filtering - Convert operators (gte, gt, lte, lt) to MongoDB format
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const parsedQuery = JSON.parse(queryStr);

    // Execute query with filters
    let query = Food.find(parsedQuery);

    // a3. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // Default sort by newest first
    }

    // a4. Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // Exclude version field by default
    }

    // a5. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);

    // Execute the query
    const foods = await query;

    res.status(200).json({
      status: 'success',
      results: foods.length,
      page,
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
