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

  rod: {
    type: String,
    default: 'Basic Rod',
  },

  ownedRods: {
  type: [String],
  default: ['Basic Rod']
  },

  equippedBait: {
  type: String,
  default: 'WB01'
  },

  baits: {
    worm: {
      type: Number,
      default: 5,
    },

    shrimp: {
      type: Number,
      default: 0,
    },

    premium: {
      type: Number,
      default: 0,
    },

    mythic: {
      type: Number,
      default: 0,
    },

    luck: {
    type: Number,
    default: 0
    },
  },
});

module.exports = mongoose.model('User', userSchema);