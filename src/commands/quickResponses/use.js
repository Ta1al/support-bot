const { Command } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class uqrCommand extends Command {
  constructor() {
    super('uqr', {
      channel: 'guild',
      category: 'Quick Responses',
      aliases: ['use-quick-response', 'uqr'],
      description: {
        content: 'Use a quick response',
        usage: '<name/alias>',
        note: `Quick responses can also be used like this: \`\`\`${config.quickResponsePrefix}<name/alias>\`\`\``
      }
    });
  }

  async condition(msg, cQr) {
    if(cQr) return cQr;
    if(!msg.guild || !msg.content.startsWith('.')) return false;
    const args = msg.content.slice(1).split(/ +/);
    const typeResolver = this.client.commandHandler.resolver.type('qr');
    const qr = await typeResolver(msg, args[0]);
    if(!qr) return false;
    return { qr, m: args[1] };
  }

  async exec(msg, args) {
    args = await this.condition(msg, args);
    if(!args.qr) return this.handler.findCommand('lqr').exec(msg);
    const member = args.m ?
      this.client.util.resolveMember(args.m, msg.guild.members.cache) ||
        await msg.client.members.fetch(args.m).catch(() => null) : // in-case the member isn't cached
      null;
    msg.delete();
    const webhooks = await msg.channel.fetchWebhooks();
    let webhook = webhooks.find(w => w.name === 'Support QR');
    if(!webhook) webhook = await msg.channel.createWebhook('Support QR');
    return webhook.send(`${member ? member.user : ''}\n${args.qr.text}`, { username: msg.author.username, avatarURL: msg.author.displayAvatarURL() });
  }
};