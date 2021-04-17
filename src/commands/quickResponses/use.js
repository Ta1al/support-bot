const { Command } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class uqrCommand extends Command {
  constructor() {
    super('uqr', {
      channel: 'guild',
      category: 'Quick Responses',
      aliases: ['use-quick-response', 'uqr'],
      description: {
        content: 'Use a quick response',
        usage: '<name/alias> [member]',
        note: `Quick responses can also be used like this: \`\`\`${config.quickResponsePrefix}<name/alias>\`\`\``
      },
      args: [
        {
          id: 'qr',
          type: 'qr',
          prompt: { optional: true }
        },
        {
          id: 'mmbr',
          type: 'member',
          prompt: { optional: true }
        }
      ]
    });
  }

  async condition(msg, args) {
    if(args && args.qr) return args;
    if(!msg.guild || !msg.content.startsWith(config.quickResponsePrefix)) return false;
    if(!args || !Object.keys(args).length) args = msg.content.slice(1).split(/ +/);
    const typeResolver = this.client.commandHandler.resolver.type('qr');
    const qr = await typeResolver(msg, args[0]);
    if(!qr) return false;
    let mmbr = null;
    if(args[1]) mmbr = msg.client.util.resolveMember(args[1], msg.guild.members.cache);
    return { qr, mmbr };
  }

  async exec(msg, args) {
    args = await this.condition(msg, args);
    if(!args.qr) return this.handler.findCommand('lqr').exec(msg);
    msg.delete();
    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(w => w.name === 'Support QR');
    if(!webhook) webhook = await msg.channel.createWebhook('Support QR');
    return webhook.send(`${args.mmbr ? args.mmbr.user : ''}\n${args.qr.text}`, { username: msg.author.username, avatarURL: msg.author.displayAvatarURL() });
  }
};