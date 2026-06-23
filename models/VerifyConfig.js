const mongoose = require('mongoose');

const verifyConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true
  },

  roleId: {
    type: String,
    required: true
  },

  channelId: {
    type: String,
    required: true
  },

  embed: {
    title: {
      type: String,
      default: '🔐 Server Verification'
    },

    description: {
      type: String,
      default: 'Klik tombol dibawah untuk memverifikasi akun Discord Anda.'
    },

    color: {
      type: String,
      default: '#5865F2'
    },

    buttonText: {
      type: String,
      default: 'Verify'
    }
  }
});

module.exports = mongoose.model(
  'VerifyConfig',
  verifyConfigSchema
);