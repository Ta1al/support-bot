const { Command, Argument } = require('discord-akairo');

class RemoveCommand extends Command {
  constructor() {
    super('Remove', {
      aliases: ['remove', 'unload'],
      category: 'dev',
      description: {
        content: 'Removes the specified command/inhibitor/listener',
        note: 'If reload module is not specified, then command with the specified name is reloaded',
        usage: '[command/inhibitor/listener] <name>',
        examples: [
          'ping',
          'listener ready',
          'inhibitor dm'
        ]
      },
      ownerOnly: true
    });
  }
  *args() {
    const mtype = yield {
      type: [
        ['command', 'commands', 'cmd', 'cmds', 'c'],
        ['inhibitor', 'inhibitors', 'i'],
        ['listener', 'listeners', 'l']
      ],
      prompt: {
        start: 'What would you like to Remove: `command`(`c`), `inhibitor`(`i`) or `listener`(`l`) ?',
        retry: 'You can only choose from `command`(`c`), `inhibitor`(`i`) or `listener`(`l`)',
        optional: true
      },
      default: 'command',
      unordered: true
    };
    const toRemove = yield {
      type: mtype === 'command' ? Argument.union('command', 'commandAlias') : mtype,
      prompt: {
        start: `What ${mtype} would you like to Remove?`,
        retry: `Please enter a valid ${mtype}`
      },
      unordered: true
    };
    return { mtype, toRemove };
  }
  /**
     * @param {Message} message
     * @param {string} module
     */
  async exec(message, { mtype, toRemove }) {
    if(mtype === 'command') this.handler.remove(toRemove);
    if(mtype === 'inhibitor') this.client.inhibitorHandler.remove(toRemove);
    if(mtype === 'listener') this.client.listenerHandler.remove(toRemove);
    return message.util.reply(`Removed \`${toRemove}\` ${mtype} ✅`);
  }
}

module.exports = RemoveCommand;