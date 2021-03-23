const { Command } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class uqrCommand extends Command {
  constructor() {
    super('uqr', {
      channel: 'guild',
      category: 'Quick Response',
      aliases: ['use-quick-response', 'uqr'],
      description: {
        content: 'Use a quick response',
        usage: '<name/alias>',
        note: `Quick responses can also be used like this: \`\`\`css\n${config.quickResponsePrefix}<name/alias>\`\`\``
      },
      args: [
        {
          id: 'qr',
          type: 'qr',
          prompt: { optional: true }
        }
      ]
    });
  }

  async condition(msg, cQr) {
    if(cQr) return cQr;
    if(!msg.guild || !msg.content.startsWith('.')) return false;
    const name = msg.content.slice(1);
    const typeResolver = this.client.commandHandler.resolver.type('qr');
    const qr = await typeResolver(msg, name);
    if(!qr) return false;
    return qr;
  }

  async exec(msg, { qr }) {
    qr = await this.condition(msg, qr);
    if(!qr) return this.handler.findCommand('lqr').exec(msg);
    msg.delete();
    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(w => w.name === 'Support QR');
    if(!webhook) webhook = await msg.channel.createWebhook('Support QR');
    return webhook.send(qr.text, { username: msg.author.username, avatarURL: msg.author.displayAvatarURL() });
  }
};