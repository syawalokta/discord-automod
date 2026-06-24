const getUser =
  require('./getUser');

module.exports = async (
  interaction,
  role
) => {

  if (
    interaction.user.id ===
    process.env.OWNER_ID
  ) {
    return true;
  }

  const user =
    await getUser(
      interaction.user.id
    );

  if (role === 'premium') {

    return (
      user.role === 'premium' ||
      user.role === 'owner'
    );

  }

  if (role === 'owner') {

    return (
      user.role === 'owner'
    );

  }

  return true;

};