const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');

router
  .route('/stats')
  .get(foodController.getFoodStats);

router
  .route('/')
  .get(foodController.getAllFoods)
  .post(foodController.createFood);

router
  .route('/:id')
  .get(foodController.getFoodById)
  .patch(foodController.updateFood)
  .delete(foodController.deleteFood);

module.exports = router;