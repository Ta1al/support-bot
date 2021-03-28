const { Command } = require('discord-akairo'), config = require('../../../../config.json');
module.exports = class createTicketCommand extends Command {
  constructor() {
    super('createTicket', {
      channel: 'guild',
      category: 'Ticket',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: [
        'EMBED_LINKS',
        'MANAGE_CHANNELS'
      ],
      aliases: ['createTicket', 'ticket'],
      prefix: config.ticketPrefix,
      description: {
        content: 'Create a ticket for a certain user.',
        usage: '<user> [reason]',
        examples: [
          'Talal Countr not working'
        ]
      },
      args: [
        {
          id: 'member',
          type: 'member',
          prompt: {
            start: '⏳ Who are you creating the ticket for?',
            retry: '❌ Please enter a valid member'
          }
        },
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

  async exec(msg, { member, reason }) {
    const typeResolver = this.handler.resolver.type('sc');
    const sch = await typeResolver(msg, msg.channel.id);
    if (!sch || sch.supportChannel !== msg.channel.id) return msg.reply('❌ This command can only be used in a support channel.');
    const category = this.client.util.resolveChannel(sch.ticketCategory, msg.guild.channels.cache);
    if (!category) return msg.reply(`❌ Ticket Category not found, please add category with command: \`${msg.util.parsed.prefix}esc ${msg.channel} <newTicketCategory>\``);
    const typeResolver2 = this.handler.resolver.type('ticket');
    const t = await typeResolver2(msg, member.id);
    if(t) var ticket = t.find(a => a.guild === msg.guild.id);
    if (ticket) {
      msg.reply(`❌ A ticket is already open for ${member.user.tag}`);
      const chnl = msg.client.channels.cache.get(ticket.channel);
      return chnl.send(msg.author);
    }
    const
      m = await msg.reply('⏳ Making a ticket, please wait.'),
      cName = `${member.user.username.slice(0, 4)}-${member.user.discriminator}`,
      topic = `Ticket for ${member.user.tag} created by ${msg.author.tag} with reason: ${reason}.`,
      chnl = await msg.guild.channels.create(cName, {
        topic,
        parent: category.id,
        type: 'text',
        reason: topic
      });
    await chnl.lockPermissions();
    await chnl.createOverwrite(member.user, { VIEW_CHANNEL: true });
    await member.user.send(`Please send me an invite to your server for your ticket (${chnl})`)
      .catch(() => chnl.send(`${member.user}, Please open your DMs and send me an invite to your server.`));
    const embed = this.client.util.embed()
      .setTitle('Ticket')
      .setDescription([
        '**User Info:**',
        `**User ID:** ${member.id}`,
        `**Account Created:** ${this.client.functions.msToTime(new Date().getTime() - member.user.createdAt)} ago`,
        `**Joined Server:** ${this.client.functions.msToTime(new Date().getTime() - member.joinedAt)} ago`
      ])
      .addField('__**Question/Issue**__', reason)
      .setColor(config.color)
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter(member.id)
      .setTimestamp();
    const tMsg = await chnl.send(`Ticket for ${member.user} created by ${msg.author}`, embed);

    const newTicket = {
      id: member.id,
      cMsg: m.id,
      tMsg: tMsg.id,
      reason,
      invite: null,
      guild: msg.guild.id,
      channel: chnl.id,
      createdBy: msg.author.id,
      createdFor: member.id,
      closed: false,
      closedBy: null,
      closeReason: null
    };

    let guildTickets = await this.client.db.get(msg.guild.id, 'Tickets', []);
    guildTickets = guildTickets.concat({ channel: chnl.id, user: member.id }); 
    await this.client.db.set(msg.guild.id, 'Tickets', guildTickets);
    
    await this.client.functions.ticket.open(this.client, member.id, newTicket);
    return m.edit(`${msg.author}, ✅ Ticket created for ${member.user.tag}. | **Status:** Open`);
  }
};