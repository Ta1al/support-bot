const { Command } = require('discord-akairo');
module.exports = class info extends Command {
  constructor() {
    super('mip', {
      category: 'Statuses',
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      aliases: ['manage-ip', 'mip'],
      description: {
        content: 'Add or remove IPs for shards',
        usage: '<addOrRemove> <name> <dns>',
        examples: ['add countr https://countr-stats.but-it-actually.works/']
      }
    });
  }

  *args() {
    let addOrRemove = yield {
      type: [
        ['add', 'a', 'create', 'c'],
        ['remove', 'r', 'delete', 'd'],
        ['list', 'l']
      ],
      prompt: {
        optional: true,
        retry: '❌ You only choose from `add` or `remove` or `list`'
      }
    };
    if(!addOrRemove || addOrRemove === 'list') {
      addOrRemove = 'list';
      return { addOrRemove };
    }
    const name = yield {
      type: async (msg, str) => {
        if (!str) return null;
        str = str.toLowerCase();
        const resolver = this.handler.resolver.type('dns');
        const dns = await resolver(msg, str);
        return addOrRemove === 'add' ?
          (dns ? null : str) :
          (dns ? str : null);
      },
      prompt: {
        start: `Enter a name for the ip to ${addOrRemove}`,
        retry: () => {
          return addOrRemove === 'add' ?
            '❌ An ip with that name already exists, please enter a unique name' :
            '❌ There is no ip with that name';
        }
      }
    };
    if(addOrRemove === 'add') var dns = yield { prompt: { start: 'Enter an ip' } };
    return { addOrRemove, name, dns };
  }

  async exec(msg, { addOrRemove, name, dns }) {
    let dnss = await this.client.db.get(msg.guild.id, 'dns', []);
    if(addOrRemove === 'list') {
      if(!dnss.length) return msg.reply('None set up.');
      return msg.reply(`List:\n\`\`\`js\n${dnss.map(a => `${a.name}: ${a.dns}`).join('\n')}\`\`\``);
    }
    if(addOrRemove === 'remove') {
      const obj = dnss.find(q => q.name === name.toLowerCase());
      dnss = this.client.functions.removeItemOnce(dnss, obj);
      await this.client.db.set(msg.guild.id, 'dns', dnss);
      return msg.reply(`Removed \`${name}\`.`);
    } else {
      dnss = dnss.concat({ name, dns });
      await this.client.db.set(msg.guild.id, 'dns', dnss);
      return msg.reply(`Added \`${name}\`.`);
    }
  }
};