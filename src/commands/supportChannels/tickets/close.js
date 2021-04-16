const { Command } = require('discord-akairo'), config = require('../../../../config.json');
module.exports = class closeTicketCommand extends Command {
  constructor() {
    super('closeTicket', {
      channel: 'guild',
      category: 'Ticket',
      aliases: ['closeTicket', 'close'],
      userPermissions: 'MANAGE_MESSAGES',
      prefix: config.ticketPrefix,
      clientPermissions: [
        'EMBED_LINKS',
        'MANAGE_CHANNELS'
      ],
      description: {
        content: 'Close a ticket',
        usage: '[Reason]',
        examples: [
          '',
          'Problem Solved'
        ]
      },
      args: [
        {
          id: 'reason',
          match: 'rest',
          prompt: {
            optional: true
          },
          default: '[Not Provided]'
        }
      ]
    });
  }

  async exec(msg, { reason }) {
    await msg.channel.lockPermissions();
    const typeResolver = this.handler.resolver.type('sc');
    const sch = await typeResolver(msg, msg.channel.parentID);
    if (!sch) return msg.reply('❌ This ticket for a moved to a different category, unable to close.');
    const guildTickets = await this.client.db.get(msg.guild.id, 'Tickets', []);
    if (!guildTickets.length) return notTicketChannel(msg);
    const gT = guildTickets.find(a => a.channel === msg.channel.id);
    if (!gT) return notTicketChannel(msg);
    const typeResolver2 = this.handler.resolver.type('ticket');
    const t = await typeResolver2(msg, gT.user);
    if (!t || !t.length) return notTicketChannel(msg);
    const ticket = t.find(a => a.channel === msg.channel.id);
    if (!ticket) return notTicketChannel(msg);
    const logChannel = msg.guild.channels.cache.get(sch.logChannel);
    if (!logChannel) return msg.reply(`❌ The log channel does not exist, please add log channel with command: \`${msg.util.parsed.prefix}esc ${msg.channel} <newLogChannel>\``);
    await msg.reply('⏳ Closing ticket, please wait.');
    const msgs = await msg.channel.messages.fetch();
    const reas = [`Info: ${msg.channel.topic}\nQuestion/Issue: ${ticket.reason}\nClosed By: ${msg.author.tag} (${msg.author.id})\nClose Reason: ${reason}\nInvite: ${ticket.invite}\n`];
    const arr = [];
    msgs.forEach(m => arr.push(`[${m.createdAt.toUTCString()}] ${m.author.tag}(${m.author.id}): ${m.content}${m.attachments.length > 0 ? `\n\nAttachments: ${m.attachments.map(a => a.url).join('\n')}` : ''}${m.embeds.length > 0 ? `\n\nEmbed: ${m.embeds.map(e => `${e.title}\n${e.description}\n${e.fields.map(f => `${f.name} : ${f.value}`).join('\n')}`).join('\n')}` : ''}`));
    arr.sort();
    const log = reas.concat(arr);
    const haste = await this.client.functions.haste(log.join('\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n'));
    const oldTicket = ticket;
    ticket.closed = true;
    ticket.closedBy = msg.author.id;
    ticket.closeReason = reason;
    await this.client.functions.ticket.close(this.client, gT.user, oldTicket, ticket);
    await logChannel.send(`Ticket closed by ${msg.author.tag} (${msg.author.id})\n**Info**:\n${msg.channel.topic}\n**Question/Issue:** ${ticket.reason}\n**Closing Reason**: ${reason}\n**Invite:** ${ticket.invite}\n**Log**: ${haste}`, { files: [ { name: `${new Date().getTime()}.txt`, attachment: Buffer.from(log.join('\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n')) } ] });
    const sc = msg.client.channels.cache.get(sch.supportChannel);
    if (sc) {
      const m = await sc.messages.fetch(ticket.cMsg);
      const str = m.content.replace('**Status:** Open', `**Status:** Closed by ${msg.author.tag} | **Reason:** ${reason}`);
      m.edit(str);
    }
    return await msg.channel.delete(reason).catch();
  }
};

function notTicketChannel(msg) {
  return msg.reply('❌ This command can only be used in a ticket channel');
}
