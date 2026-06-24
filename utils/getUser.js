const User = require('../models/User');

module.exports = async (userId) => {

  let user = await User.findOne({
    userId
  });

  if (!user) {

    user = await User.create({
      userId
    });

  }

  return user;
};