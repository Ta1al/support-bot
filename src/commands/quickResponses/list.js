const { Command } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class lqrCommand extends Command {
  constructor() {
    super('lqr', {
      channel: 'guild',
      category: 'Quick Responses',
      aliases: ['list-quick-responses', 'list-quick-response', 'lqr'],
      description: {
        content: 'Get a list of quick responses*',
        usage: '[name/alias]'
      },
      args: [
        {
          id: 'qr',
          type: 'qr',
          match: 'rest',
          prompt: {
            retry: '⚠ No quick-response with that name/alias exists, try again.',
            optional: true
          }
        }
      ]
    });
  }

  async exec(msg, args) {
    if (args.qr) {
      const embed = this.client.util.embed()
        .setTitle(args.qr.name.toUpperCase())
        .setColor(config.color)
        .setFooter(`Requested by ${msg.author.tag}`, msg.author.displayAvatarURL())
        .setDescription(args.qr.text)
        .addField('Aliases', args.qr.aliases.map(a => `\`${a}\``).join(', '));
      return msg.channel.send(embed);
    }
    const qrs = await this.client.db.get(msg.guild.id, 'qr', []);
    if (!qrs.length) return msg.reply('❌ There are no quick responses');
    return msg.reply('The following quick-responses are available:\n' + qrs.sort((a, b) => (a.name > b.name) ? 1 : -1).map(q => `\`${q.name}\``).join(', '));
  }
};