const mongoose = require('mongoose');

const verifiedUserSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },

  userId: {
    type: String,
    required: true
  },

  username: {
    type: String
  },

  verifiedAt: {
    type: Date,
    default: Date.now
  }
});

verifiedUserSchema.index(
  {
    guildId: 1,
    userId: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  'VerifiedUser',
  verifiedUserSchema
);