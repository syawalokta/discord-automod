const mongoose = require('mongoose');

const inviteJoinSchema =
  new mongoose.Schema({

    guildId: String,

    userId: String,

    inviterId: String

  });

module.exports =
  mongoose.model(
    'InviteJoin',
    inviteJoinSchema
  );