module.exports = {
  name: 'inviteCreate',

  async execute(invite) {

    const invites =
      invite.client.invites.get(
        invite.guild.id
      ) || new Map();

    invites.set(
      invite.code,
      invite.uses
    );

    invite.client.invites.set(
      invite.guild.id,
      invites
    );

  }
};