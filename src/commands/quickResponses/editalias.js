const { Command } = require('discord-akairo'), config = require('../../../config.json');
class eqraCommand extends Command {
  constructor() {
    super('eqra', {
      category: 'Quick Responses',
      channel: 'guild',
      userPermissions: 'MANAGE_MESSAGES',
      clientPermissions: 'EMBED_LINKS',
      aliases: ['edit-quick-response-alias', 'eqra'],
      description: {
        content: 'Edit a quick response',
        usage: '<name> <addOrRemove> <alias>',
        examples: [
          'cool remove noice',
          'cool add nice'
        ]
      }
    });
  }

  *args() {
    const qr = yield {
      type: 'qr',
      prompt: {
        start: 'Enter the quick response name.',
        retry: '❌ No quick response with that name exists. Please try again'
      }
    };
    const addOrRemove = yield {
      type: [
        ['add', 'a', 'create', 'c'],
        ['remove', 'r', 'delete', 'd']
      ],
      prompt: {
        start: 'Do you want to `add` or `remove` an alias?',
        retry: '❌ You only choose from `add` or `remove`'
      }
    };
    const alias = yield {
      type: async (_, str) => {
        if (!str) return null;
        str = str.toLowerCase();
        const incl = qr.aliases.includes(str);
        return addOrRemove === 'add' ?
          (incl ? null : str) :
          (incl ? str : null);
      },
      prompt: {
        start: `Enter an alias to ${addOrRemove}`,
        retry: () => {
          return addOrRemove === 'add' ?
            '❌ A quick response with that name or alias already exists. Please enter a name/alias.' :
            '❌ This quick response does not have this alias. Enter an alias to remove.';
        }
      }
    };
    return { qr, addOrRemove, alias };
  }

  async exec(msg, { qr, addOrRemove, alias }) {
    if (qr.aliases.length === 1 && addOrRemove === 'remove') return msg.reply('❌ Failed to remove alias. A quick response must have at least 1 alias.');
    const embed = msg.client.util.embed()
      .setColor(config.color)
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .addFields([
        { name: 'Name', value: qr.name, inline: true },
        { name: 'Edited Aliases', value: makeStr(qr, alias, addOrRemove), inline: true },
        { name: 'Text', value: qr.text }
      ]);
    let qrs = await this.client.db.get(msg.guild.id, 'quickResponse', []);
    qrs = qrs.filter(q => q.name !== qr.name);
    qr.aliases = addOrRemove === 'add' ? qr.aliases.concat(alias) :
      qr.aliases.filter(a => a !== alias);
    await this.client.db.set(msg.guild.id, 'quickResponse', qrs);

    msg.reply(`✅ Alias ${addOrRemove === 'add' ? 'added' : 'removed'} succesfully!`, embed);
  }
}

function makeStr(qr, alias, addOrRemove) {
  const str1 = qr.aliases.map(a => a === alias ? `~~**\`${a}\`**~~` : `\`${a}\``).join(', '),
    str2 = addOrRemove === 'add' ? `, __**\`${alias}\`**__` : '';
  return str1 + str2;
}

module.exports = eqraCommand;