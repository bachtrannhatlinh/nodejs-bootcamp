require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const foodRoute = require('./routes/foodRoute');

const mongoURI = process.env.MONGODB;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();

app.use(express.json());
app.use('/api/foods', foodRoute);

app.listen(3000, () => console.log('Server running on port 3000'));

console.log('Hello Node.js Bootcamp!');