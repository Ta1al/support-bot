const { Command } = require('discord-akairo');

class ReloadCommand extends Command {
  constructor() {
    super('reloadall', {
      aliases: ['reloadall', 'ra'],
      category: 'dev',
      description: {
        content: 'Reloads all the commands/inhibitors/listeners',
        note: 'If no argument is provided, all commands are loaded.',
        examples: [
          '',
          'listener',
          'inhibitor'
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
        start: 'What would you like to Reload: `command`(`c`), `inhibitor`(`i`) or `listener`(`l`) ?',
        retry: 'You can only choose from `command`(`c`), `inhibitor`(`i`) or `listener`(`l`)',
        optional: true
      },
      default: 'command',
      unordered: true
    };
    return { mtype };
  }
  /**
     * @param {Message} message
     * @param {string} module
     */
  async exec(message, { mtype }) {
    if(mtype === 'command') this.handler.reloadAll();
    if(mtype === 'inhibitor') this.client.inhibitorHandler.reloadAll();
    if(mtype === 'listener') this.client.listenerHandler.reloadAll();
    return message.util.reply(`Reloaded \`all\` ${mtype}s ✅`);
  }
}

module.exports = ReloadCommand;