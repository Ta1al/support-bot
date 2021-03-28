const { Listener } = require('discord-akairo');
class messageListener extends Listener {
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message'
    });
  }

  async exec(msg) {
    if (msg.author.bot) return;
    const { prefix } = this.client.commandHandler;
    if (msg.content === `<@!${this.client.user.id}>`) return msg.reply(`My prefix is \`${prefix}\``);

    // Tickets
    if (!msg.guild) {
      const typeResolver2 = this.client.commandHandler.resolver.type('ticket');
      const tickets = await typeResolver2(msg, msg.author.id);
      if (!tickets || !tickets.length) return;
      const invite = await msg.client.fetchInvite(msg.content);
      if (!invite) return msg.react('❌');
      return await this.handleInv(tickets[0], msg, invite);
    }

    return;
  }

  async handleInv(ticket, msg, invite) {
    const chnl = this.client.channels.cache.get(ticket.channel);
    await chnl.send(`${msg.author}, invite received: ${invite.url}`);
    const oldTicket = ticket;
    ticket.invite = invite.code;
    await this.client.functions.ticket.edit(this.client, msg.author.id, oldTicket, ticket);
    return msg.react('✅');
  }
}

module.exports = messageListener;