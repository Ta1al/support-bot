const { Command } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class rscCommand extends Command {
  constructor() {
    super('rsc', {
      channel: 'guild',
      category: 'Support Channels',
      aliases: ['remove-support-channel', 'rsc'],
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      description: {
        content: 'Remove a support channel',
        usage: '<supportChannelID>',
        examples: [
          '#countr-support'
        ]
      },
      args: [
        {
          id: 'sc',
          type: 'supportChannel',
          prompt: {
            start: '⏳ Enter Support Channel to Remove',
            retry: '❌ That is not a support channel. Please try again.'
          }
        }
      ]
    });
  }

  async exec(msg, { sc }) {
    let scs = await this.client.db.get(msg.guild.id, 'sc', []);
    const embed = this.client.util.embed()
      .setColor(config.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(`**Support Channel:** <#${sc.supportChannel}>\n**Ticket Category:** <#${sc.ticketCategory}>\n**Logs Channel:** <#${sc.logChannel}>`);
    const m = await msg.reply('⚠ Are you sure you want to remove this support channel?', embed);
    await this.client.functions.addReactions(m, '✅', '❌');

    const filter = (reaction, user) => {
      return ['✅', '❌'].includes(reaction.emoji.name) && user.id === msg.author.id;
    };
    
    const collector = m.createReactionCollector(filter, { time: 15000, max: 1 });
    
    collector.on('collect', async reaction => {
      if(reaction.emoji.name === '❌') return msg.reply('❌ Command Cancelled');
      scs = this.client.functions.removeItemOnce(scs, sc);
      await this.client.db.set(msg.guild.id, 'sc', scs);
      return msg.reply('✅ Removed support channel successfully!');
    });
    
    collector.on('end', collected => {
      if(collected.size == 0) msg.reply('❌ Command Cancelled');
      return m.reactions.removeAll().catch();
    });
  }
};