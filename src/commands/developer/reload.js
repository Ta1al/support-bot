const { Command, Argument } = require('discord-akairo');

class reloadCommand extends Command {
  constructor() {
    super('reload', {
      aliases: ['reload', 'r'],
      category: 'dev',
      description: {
        content: 'Reload specified command/inhibitor/listener',
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
        start: 'What would you like to reload: `command`(`c`), `inhibitor`(`i`) or `listener`(`l`) ?',
        retry: 'You can only choose from `command`(`c`), `inhibitor`(`i`) or `listener`(`l`)',
        optional: true
      },
      default: 'command',
      unordered: true
    };
    const toReload = yield {
      type: mtype === 'command' ? Argument.union('command', 'commandAlias') : mtype,
      prompt: {
        start: `What ${mtype} would you like to reload?`,
        retry: `Please enter a valid ${mtype}`
      },
      unordered: true
    };
    return { mtype, toReload };
  }
  /**
     * @param {Message} message
     * @param {string} module
     */
  async exec(message, { mtype, toReload }) {
    if(mtype === 'command') this.handler.reload(toReload);
    if(mtype === 'inhibitor') this.client.inhibitorHandler.reload(toReload);
    if(mtype === 'listener') this.client.listenerHandler.reload(toReload);
    return message.util.reply(`Reloaded \`${toReload}\` ${mtype} ✅`);
  }
}

module.exports = reloadCommand;