const { Command } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class listscCommand extends Command {
  constructor() {
    super('listsc', {
      category: 'Support Channel',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['list-support-channels', 'lsc'],
      description: {
        content: 'Get a list of support channels'
      }
    });
  }

  async exec(msg) {
    const scs = await this.client.db.get(msg.guild.id, 'sc', []);
    if(!scs.length) return msg.reply('❌ No support channels have been added in this server!');
    const embed = this.client.util.embed()
      .setColor(config.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setTitle('List of Support Channels');
    scs.forEach((sc, i) => {
      embed.addField(`__*#${i + 1}*__`, `**Support Channel:** <#${sc.supportChannel}>\n**Ticket Category:** <#${sc.ticketCategory}>\n**Logs Channel:** <#${sc.logChannel}>`, true);
    });
    return msg.channel.send(embed);
  }
};