const { Command } = require('discord-akairo');
const fetch = require('node-fetch');
module.exports = class info extends Command {
  constructor() {
    super('ss', {
      category: 'Utility',
      channel: 'guild',
      aliases: ['shard-status', 'ss'],
      description: {
        content: 'Provides status of all shards'
      }
    });
  }

  async exec(msg) {
    let dnss = await this.client.db.get(msg.guild.id, 'dns', []);
    dnss = dnss.sort((a, b) => (a.name > b.name) ? 1 : -1);
    if (!dnss.length) return msg.reply('None set up.');
    const m = await msg.reply('⌛ Hold on...');
    const arr = [];
    for (const obj of dnss) {
      const data = await fetch(obj.dns).then(r => r.json()).catch(e => { if (e) return '❌ Error'; });
      if (data !== '❌ Error') {
        const [ready, connecting, reconnecting, idling, nearly, disconnecting, waiting, identifying, resuming] = [[], [], [], [], [], [], [], [], []], loading = [];
        Object.keys(data.shards).forEach(sh => {
          if (sh.loading) loading.push(sh);
          [ready, connecting, reconnecting, idling, nearly, disconnecting, waiting, identifying, resuming][data.shards[sh].status].push(sh);
        });
        const b = [
          `__**${obj.name.toUpperCase()}**__\n`,
          loading.length ? `**Loading:** ${loading.join(', ')}\n` : '',
          ready.length ? `**Ready:** ${ready.join(', ')}\n` : '',
          connecting.length ? `**Connecting:** ${connecting.join(', ')}\n` : '',
          reconnecting.length ? `**Reconnecting:** ${reconnecting.join(', ')}\n` : '',
          idling.length ? `**Idling:** ${idling.join(', ')}\n` : '',
          nearly.length ? `**Nearly:** ${nearly.join(', ')}\n` : '',
          disconnecting.length ? `**Disconnecting:** ${disconnecting.join(', ')}\n` : '',
          waiting.length ? `**Waiting for Guilds:** ${waiting.join(', ')}\n` : '',
          identifying.length ? `**Identifying:** ${identifying.join(', ')}\n` : '',
          resuming.length ? `**Resuming:** ${resuming.join(', ')}` : ''
        ].join('');
        arr.push(b);
      } else {
        arr.push(`__**${obj.name.toUpperCase()}**__\n${data}`);
      }
    }
    return m.edit(arr.join('\n'));
  }
};