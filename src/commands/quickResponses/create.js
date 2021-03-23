const { Command } = require('discord-akairo');
module.exports = class aqrCommand extends Command {
  constructor() {
    super('aqr', {
      channel: 'guild',
      category: 'Quick Responses',
      aliases: ['create-quick-response', 'aqr', 'cqr'],
      description: {
        content: 'Create a quick response',
        usage: '<name> <text>',
        examples: [
          'cool You are cool'
        ]
      },
      args: [
        {
          id: 'name',
          type: async (msg, str) => {
            if (!str) return null;
            const resolver = this.handler.resolver.type('qr');
            const qr = await resolver(msg, str);
            if (qr) return null;
            return str.toLowerCase();
          },
          prompt: {
            start: '⏳ Enter the quick-response name',
            retry: '⚠ Another quick-response with this name/alias already exists. Please enter a unique name'
          }
        },
        {
          id: 'text',
          match: 'rest',
          prompt: {
            start: '⏳ Enter the quick-response text'
          }
        },
        {
          id: 'aliases',
          match: 'none',
          type: async (msg, str) => {
            if (!str) return null;
            const resolver = this.handler.resolver.type('qr');
            const qr = await resolver(msg, str);
            if (qr) return null;
            return str.toLowerCase();
          },
          prompt: {
            infinite: true,
            start: '⏳ Enter quick-response aliases.\n\n__Send each alias in a separate message.__\n> Type `stop` when you\'re done',
            retry: (_, { phrase: val }) => {
              if (val.toLowerCase() === 'stop') return '⚠ You must enter at least 1 alias (can be same as the name)\nType `stop` when you\'re done';
              return '⚠ A quick response with that name or alias already exists. Please enter unique aliases.\nType `stop` when you\'re done';
            }
          }
        }
      ]
    });
  }

  async exec(msg, args) {
    const qrs = await this.client.db.get(msg.guild.id, 'qr', []);
    await this.client.db.set(msg.guild.id, 'qr', qrs.concat(args));
    return msg.reply('✅ Quick-response added.');
  }
};