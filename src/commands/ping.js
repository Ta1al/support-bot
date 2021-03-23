const { Command } = require('discord-akairo');

class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping', 'latency', 'uptime', 'ut'],
      cooldown: 3e3
    });
  }

  async exec(msg) {
    const sent = await msg.util.reply('📶 Pinging...');
    const timeDiff = sent.createdTimestamp - msg.createdTimestamp;
    const uptime = this.client.functions.msToTime(this.client.uptime);
    return sent.edit([
      '📶 Pong!',
      `🔂 **Response Time**: ${timeDiff} ms`,
      `💓 **API Latency**: ${Math.round(this.client.ws.ping)} ms`,
      `🕑 **Uptime**: ${uptime}`
    ]);
  }
}

module.exports = PingCommand;