const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

  guildId: {
    type: String,
    required: true,
    index: true
  },

  channelId: {
    type: String,
    required: true,
    index: true
  },

  productId: {
    type: Number,
    required: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  emoji: {
    type: String,
    default: '📦'
  },

  description: {
    type: String,
    default: 'No description.'
  },

  content: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

productSchema.index({
  guildId: 1,
  channelId: 1,
  productId: 1
}, {
  unique: true
});

module.exports = mongoose.model(
  'Product',
  productSchema
);