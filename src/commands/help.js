const { Command } = require('discord-akairo'), config = require('../../config.json');
class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help'],
      category: 'Utility',
      clientPermissions: ['EMBED_LINKS'],
      cooldown: 3e3,
      args: [
        {
          id: 'command',
          type: 'commandAlias',
          prompt: {
            start: 'Which command do you need help with?',
            retry: 'Please provide a valid command.',
            optional: true
          }
        }
      ],
      description: {
        content: 'Displays a list of commands or information about a command.',
        usage: '[command]',
        examples: ['', 'aqr', 'ping']
      }
    });
  }

  async exec(message, { command, cancel }) {
    if (!command) return this.execCommandList(message);
    if (!checkPermissions(message, command)) return message.react('❌');
    const prefix = command.prefix ? command.prefix : message.util.parsed.prefix;
    const description = Object.assign({
      content: 'No description available.',
      image: '',
      usage: '',
      examples: [],
      fields: []
    }, command.description);

    const embed = this.client.util.embed()
      .setImage(description.image)
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(config.color)
      .setTitle(`\`${prefix}${command.aliases[0]} ${description.usage ? description.usage : ''}\``)
      .addField('Description', description.content);

    for (const field of description.fields) embed.addField(field.name, field.value);
    if (description.note) {
      embed.addField('Note', description.note);
    }
    if (description.examples.length) {
      const text = `${prefix}${command.aliases[0]}`;
      embed.addField('Examples', `\`${text} ${description.examples.length > 0 ? description.examples.join(`\`\n\`${text} `) : ''}\``, true);
    }

    if (command.aliases.length > 1) {
      embed.addField('Aliases', `\`${command.aliases.join('` `')}\``);
    }

    return message.channel.send(cancel ? `${message.author}, ⚠ Retry limit reached! Please try again.` : '', { embed });
  }

  async execCommandList(message) {
    const prefix = message.util.parsed.prefix;
    const embed = this.client.util.embed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setColor(config.color)
      .addField('Command List',
        [
          'This is a list of commands.',
          `To view details for a command, do \`${prefix}help <command>\`.`
        ]);
    this.handler.categories.sort((a, b) => a.size - b.size).forEach(c => {
      const a = [];
      let b;
      c.sort((x, y) => (x.aliases[0] || x.id).length - (y.aliases[0] || y.id).length).forEach(v => {
        if (checkPermissions(message, v)) {
          a.push(`\`${v.aliases[0]}\``);
          b = v.categoryID.toUpperCase();
        }
      });
      if (a.length > 0) embed.addField(b, a.join(' '));
    });

    await message.channel.send({ embed });

    return undefined;
  }
}

function checkPermissions(msg, cmd) {
  if (
    (msg.member ? msg.member.hasPermission(cmd.userPermissions) : true) &&
    (cmd.ownerOnly ? msg.author.id === config.owner : true) &&
    (cmd.channel === 'guild' && !msg.member ? false : true)) return true;
  return false;
}

module.exports = HelpCommand;
