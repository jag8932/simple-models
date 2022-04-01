// Basic schema steps

// 1. Require mongoose
const mongoose = require('mongoose');

// 2. Create empty object to be exported

let DogModel = {};

// 3. Create Schema for the model. Creates a new mongoose schema
// object.

const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});
// 4. Assign the DogModel the schema using mongoose.model() and export it.
DogModel = mongoose.model('Dog', dogSchema);

module.exports = DogModel;
