const InviteLog = require('../models/InviteLog');
const InviteStats = require('../models/InviteStats');
const InviteJoin = require('../models/InviteJoin');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member) {

    const config =
      await InviteLog.findOne({
        guildId: member.guild.id
      });

    if (!config) return;

    const channel =
      member.guild.channels.cache.get(
        config.channelId
      );

    if (!channel) return;

    /*
     * INVITE TRACKER
     */
    const oldInvites =
      member.client.invites.get(
        member.guild.id
      );

    const newInvites =
      await member.guild.invites.fetch();

    let inviter = null;

    for (const invite of newInvites.values()) {

  const previous =
    oldInvites?.get(
      invite.code
    ) || 0;

  if (invite.uses > previous) {

    inviter =
      invite.inviter;

    const existingJoin =
      await InviteJoin.findOne({
        guildId:
          member.guild.id,

        userId:
          member.id
      });

    if (!existingJoin) {

      await InviteStats.findOneAndUpdate(
        {
          guildId:
            member.guild.id,

          userId:
            inviter.id
        },
        {
          $inc: {
            invites: 1
          }
        },
        {
          upsert: true
        }
      );

      await InviteJoin.create({
        guildId:
          member.guild.id,

        userId:
          member.id,

        inviterId:
          inviter.id
      });

    }

    break;

  }

    }

    member.client.invites.set(
      member.guild.id,
      new Map(
        newInvites.map(inv => [
          inv.code,
          inv.uses
        ])
      )
    );

    /*
     * TOTAL INVITES
     */
    let totalInvite = 0;

    if (inviter) {

      const stats =
        await InviteStats.findOne({
          guildId: member.guild.id,
          userId: inviter.id
        });

      totalInvite =
        stats?.invites || 0;
    }

    /*
     * PLACEHOLDERS
     */
    const content =
      config.message

        .replace(
          /\$user/g,
          `<@${member.id}>`
        )

        .replace(
          /\$username/g,
          member.user.username
        )

        .replace(
          /\$userid/g,
          member.id
        )

        .replace(
          /\$server/g,
          member.guild.name
        )

        .replace(
          /\$totalmember/g,
          member.guild.memberCount
        )

        .replace(
          /\$inviteby/g,
          inviter
            ? `<@${inviter.id}>`
            : 'Unknown'
        )

        .replace(
          /\$invitecount/g,
          totalInvite
        )

        .replace(
          /\$totalinvite/g,
          totalInvite
        );

    await channel.send({
      content
    });

  }
};