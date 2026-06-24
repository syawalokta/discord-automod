const GuildSettings = require('../models/GuildSettings');
const PrefixConfig = require('../models/PrefixConfig');

const spamTracker = new Map();

const LINK_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/gi;

module.exports = {
  name: 'messageCreate',

  async execute(message) {

    if (
      message.author.bot ||
      !message.guild
    ) return;

    /*
     * PREFIX COMMAND HANDLER
     */
    try {

      const prefixConfig =
        await PrefixConfig.findOne({
          guildId: message.guild.id
        });

      const prefix =
        prefixConfig?.prefix || '!';

      if (
        message.content.startsWith(prefix)
      ) {

        const args =
          message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/);

        const commandName =
          args.shift()?.toLowerCase();

        const command =
          message.client.commands.get(
            commandName
          );

        if (command?.run) {

          try {

            await command.run(
              message,
              args
            );

          } catch (err) {

            console.error(
              '[Prefix Command]',
              err
            );

            await message.reply(
              '❌ Command error.'
            );

          }

          return;
        }
      }

    } catch (err) {

      console.error(
        '[Prefix Handler]',
        err
      );

    }

    /*
     * AUTOMOD
     */
    let settings;

    try {

      settings =
        await GuildSettings.findOne({
          guildId: message.guild.id
        });

    } catch (_) {

      return;

    }

    if (!settings?.automodEnabled)
      return;

    const isStaff =
      message.member?.permissions.has(0x8n) ||
      message.member?.roles.cache.some(
        r => r.permissions.has(0x8n)
      );

    if (isStaff) return;

    /*
     * ANTI LINK
     */
    if (
      settings.antiLink &&
      LINK_REGEX.test(
        message.content
      )
    ) {

      LINK_REGEX.lastIndex = 0;

      try {

        await message.delete();

        const warn =
          await message.channel.send({
            content:
              `🔗 No links allowed, <@${message.author.id}>!`
          });

        setTimeout(() => {
          warn.delete().catch(() => {});
        }, 5000);

      } catch (err) {

        console.error(
          '[antiLink] Error:',
          err.message
        );

      }

      return;
    }

    LINK_REGEX.lastIndex = 0;

    /*
     * ANTI SPAM
     */
    if (settings.antiSpam) {

      const key =
        `${message.guild.id}:${message.author.id}`;

      const now =
        Date.now();

      const threshold =
        settings.spamThreshold || 5;

      const interval =
        settings.spamInterval || 5000;

      if (!spamTracker.has(key)) {
        spamTracker.set(key, []);
      }

      const timestamps =
        spamTracker
          .get(key)
          .filter(
            ts => now - ts < interval
          );

      timestamps.push(now);

      spamTracker.set(
        key,
        timestamps
      );

      setTimeout(() => {

        const t =
          spamTracker.get(key);

        if (t) {

          spamTracker.set(
            key,
            t.filter(
              ts =>
                Date.now() - ts <
                interval
            )
          );

        }

      }, interval);

      if (
        timestamps.length >=
        threshold
      ) {

        try {

          await message.delete();

          const warn =
            await message.channel.send({
              content:
                `⚠️ Slow down, <@${message.author.id}>! You're sending messages too fast.`
            });

          spamTracker.set(
            key,
            []
          );

          setTimeout(() => {
            warn.delete().catch(() => {});
          }, 5000);

        } catch (err) {

          console.error(
            '[antiSpam] Error:',
            err.message
          );

        }
      }
    }
  }
};