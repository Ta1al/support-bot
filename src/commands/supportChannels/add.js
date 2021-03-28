const { Command, Argument } = require('discord-akairo'), config = require('../../../config.json');
module.exports = class ascCommand extends Command {
  constructor() {
    super('asc', {
      channel: 'guild',
      category: 'Support Channels',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['add-support-channel', 'asc'],
      description: {
        content: 'Add a support channel',
        usage: '<supportChannel> <ticketCategory> <logChannel>',
        examples: [
          '#countr-support tickets #ticket-logs'
        ]
      }
    });
  }

  *args() {
    const sc = yield {
      type: Argument.validate('textChannel', async (msg, str) => {
        const typeResolver = this.handler.resolver.type('sc');
        const sch = await typeResolver(msg, str);
        if (sch) return false;
        return true;
      }),
      prompt: {
        start: '⏳ Enter the support channel',
        retry: async (msg, str) => {
          const typeResolver = this.handler.resolver.type('sc');
          const sch = await typeResolver(msg, str);
          if (sch) return '⚠ This channel has already been added. Please enter a different channel.';
          return '⚠ Please enter a valid support channel.';
        }
      }
    };
    const tc = yield {
      type: Argument.validate('channel', (_m, _s, val) => val.type === 'category'),
      prompt: {
        start: '⏳ Enter the ticket category channel',
        retry: '⚠ Please enter a valid category channel.'
      }
    };
    const lc = yield {
      type: 'textChannel',
      prompt: {
        start: '⏳ Enter the ticket logs channel',
        retry: '⚠ Please enter a valid log channel.'
      }
    };
    return { sc, tc, lc };
  }

  async exec(msg, { sc, tc, lc }) {
    let scs = await this.client.db.get(msg.guild.id, 'sc', []);
    scs = scs.concat(
      {
        supportChannel: sc.id,
        ticketCategory: tc.id,
        logChannel: lc.id
      }
    );
    await this.client.db.set(msg.guild.id, 'sc', scs);
    const embed = this.client.util.embed()
      .setColor(config.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setDescription(`**Support Channel:** ${sc}\n**Ticket Category:** ${tc}\n**Logs Channel:** ${lc}`);
    return msg.reply('✅ Support Channel added!', embed);
  }
};