const { Command, Argument } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class escCommand extends Command {
  constructor() {
    super('esc', {
      channel: 'guild',
      category: 'Support Channels',
      clientPermissions: 'EMBED_LINKS',
      userPermissions: 'MANAGE_MESSAGES',
      aliases: ['edit-support-channel', 'esc'],
      description: {
        content: 'Edit a support channel',
        usage: '<supportChannel> <new-TicketCategory-Or-LogChannel>',
        examples: [
          '#countr-support tickets',
          '#countr-support #log-channel'
        ]
      },
      args: [
        {
          id: 'sc',
          type: 'sc',
          prompt: {
            start: '⏳ Enter the support channel to edit.',
            retry: '⚠ That is not a support channel. Please enter a valid support channel.'
          }
        },
        {
          id: 'tcOrLc',
          type: Argument.validate('channel', (_m, _p, val) => ['text', 'category'].includes(val.type)),
          prompt: {
            start: '⏳ Enter a new ticket category channel or log channel',
            retry: '⚠ Please enter a valid category/log channel'
          }
        }
      ]
    });
  }

  async exec(msg, { sc, tcOrLc }) {
    let scs = await this.client.db.get(msg.guild.id, 'sc', []);
    scs = this.client.functions.removeItemOnce(scs, sc);
    const embed = this.client.util.embed()
      .setColor(config.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .addField('__Before__', `**Support Channel:** <#${sc.supportChannel}>\n**Ticket Category:** <#${sc.ticketCategory}>\n**Logs Channel:** <#${sc.logChannel}>`);
    sc = tcOrLc.type === 'category' ?
      sc.ticketCategory = tcOrLc :
      sc.logChannel = tcOrLc;
    scs = scs.concat(sc);
    embed.addField('__After__', `**Support Channel:** <#${sc.supportChannel}>\n**Ticket Category:** <#${sc.ticketCategory}>\n**Logs Channel:** <#${sc.logChannel}>`);
    const m = await msg.reply('⚠ Are you sure you want to edit this support channel?', embed);
    await this.client.functions.addReactions(m, '✅', '❌');

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };
    
    const collector = m.createReactionCollector(filter, { time: 15000, max: 1 });
    
    collector.on('collect', async reaction => {
      if(reaction.emoji.name === '❌') return msg.reply('❌ Command Cancelled');
      await this.client.db.set(msg.guild.id, 'sc', scs);
      return msg.reply('✅ Edited support channel successfully!');
    });
    
    collector.on('end', collected => {
      if(collected.size == 0) msg.reply('❌ Command Cancelled');
      return m.reactions.removeAll().catch();
    });
  }
};