const { Command } = require('discord-akairo'), config = require('../../../config.json');
class eqrCommand extends Command {
  constructor() {
    super('eqr', {
      category: 'Quick Response',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['edit-quick-response', 'eqr'],
      description: {
        content: 'Edit a quick response',
        usage: '<name> <newResponse>',
        examples: [
          'cool You are cool and nice'
        ]
      },
      args: [
        {
          id: 'qr',
          type: 'qr',
          prompt: {
            start: 'Enter name or alias of a quick response.',
            retry: '❌ No quick response exists with that name or alias. Please try again.'
          }
        },
        {
          id: 'newResponse',
          match: 'rest',
          prompt: {
            start: 'Enter a new response'
          }
        }
      ]
    });
  }

  async exec(msg, { qr, newResponse }) {
    const embed = msg.client.util.embed()
      .setColor(config.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .addFields([
        { name: 'Name', value: qr.name, inline: true },
        { name: 'Aliases', value: qr.aliases.map(a => `\`${a}\``).join(', '), inline: true },
        { name: 'Old Response', value: qr.text },
        { name: 'New Response', value: newResponse }
      ]);
    let qrs = await this.client.db.get(msg.guild.id, 'qr', []);
    qrs = qrs.filter(q => q.name !== qr.name);
    qr.text = newResponse;
    qrs = qrs.concat(qr);
    await this.client.db.set(msg.guild.id, 'qr', qrs);
    return msg.reply('✅ Quick-response edited!', embed);
  }
}


module.exports = eqrCommand;