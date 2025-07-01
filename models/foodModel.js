const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Italian', 'Japanese', 'American', 'Chinese', 'Mexican', 'Indian', 'Thai', 'French', 'Vietnamese', 'Korean'],
      message: 'Category must be one of the specified values'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    max: [1000, 'Price cannot exceed 1000']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  calories: {
    type: Number,
    min: [0, 'Calories cannot be negative'],
    max: [5000, 'Calories cannot exceed 5000']
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  preparationTime: {
    type: Number, // in minutes
    min: [1, 'Preparation time must be at least 1 minute'],
    max: [480, 'Preparation time cannot exceed 8 hours']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5'],
    default: 4.0
  },
  image: {
    type: String,
    default: 'default-food.jpg'
  },
  chef: {
    type: String,
    trim: true
  },
  restaurant: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes để tối ưu performance cho getFoodStats
foodSchema.index({ category: 1 }); // Index cho group by category
foodSchema.index({ price: 1 });    // Index cho price operations
foodSchema.index({ createdAt: -1 }); // Index cho default sorting

// Virtual field - Price per calorie
foodSchema.virtual('pricePerCalorie').get(function() {
  if (this.calories && this.calories > 0) {
    return (this.price / this.calories).toFixed(4);
  }
  return null;
});

// Instance method - Check if expensive
foodSchema.methods.isExpensive = function() {
  return this.price > 50;
};

// Static method - Get foods by category
foodSchema.statics.findByCategory = function(category) {
  return this.find({ category: category });
};

// Pre-save middleware
foodSchema.pre('save', function(next) {
  // Capitalize first letter of name
  if (this.isModified('name')) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1);
  }
  next();
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;