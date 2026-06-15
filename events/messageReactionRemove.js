const ReactionRole = require('../models/ReactionRole');

module.exports = {
  name: 'messageReactionRemove',

  async execute(reaction, user) {

    if (user.bot) return;

    if (reaction.partial)
      await reaction.fetch();

    const data =
      await ReactionRole.findOne({
        messageId: reaction.message.id,
        emoji: reaction.emoji.name
      });

    if (!data) return;

    const member =
      await reaction.message.guild.members.fetch(
        user.id
      );

    await member.roles.remove(data.roleId);
  }
};