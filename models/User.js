const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },

  wallet: {
    type: Number,
    default: 0,
  },

  bank: {
    type: Number,
    default: 0,
  },

  lastDaily: {
    type: Date,
    default: null,
  },

  role: {
    type: String,
    enum: [
      'user',
      'premium',
      'owner'
    ],
    default: 'user',
  },

  premiumUntil: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('User', userSchema);