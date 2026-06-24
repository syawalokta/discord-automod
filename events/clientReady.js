module.exports = {
  name: 'clientReady',
  once: true,

  async execute(client) {

    for (const guild of client.guilds.cache.values()) {

      const invites =
        await guild.invites.fetch();

      client.invites.set(
        guild.id,
        new Map(
          invites.map(inv => [
            inv.code,
            inv.uses
          ])
        )
      );

    }

  }
};