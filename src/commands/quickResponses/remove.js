const { Command } = require('discord-akairo');
module.exports = class rqrCommand extends Command {
  constructor() {
    super('rqr', {
      channel: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      category: 'Quick Responses',
      aliases: ['remove-quick-response', 'rqr', 'dqr'],
      description: {
        content: 'Remove a quick response',
        usage: '<name/alias>'
      },
      args: [
        {
          id: 'qr', 
          match: 'rest',
          type: 'qr',
          prompt: {
            start: '⏳ Enter the quick-response name/alias',
            retry: '⚠ No quick-response with that name/alias found, please try again.'
          }
        }
      ]
    });
  }

  async exec(msg, { qr }) {
    const qrs = await this.client.db.get(msg.guild.id, 'qr', []);
    await this.client.db.set(msg.guild.id, 'qr', qrs.filter(q => q.name !== qr.name));
    return msg.reply('✅ Quick-response removed.');
  }
};