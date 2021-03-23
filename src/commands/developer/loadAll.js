const { Command } = require('discord-akairo');

class LoadCommand extends Command {
  constructor() {
    super('loadall', {
      aliases: ['loadall', 'load', 'la'],
      category: 'dev',
      description: {
        content: 'Loads all the commands/inhibitors/listeners.',
        note: 'If no argument is provided, all commands are loaded.',
        usage: '[command/inhibitor/listener]',
        examples: [
          '',
          'inhibitor',
          'listener'
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
        start: 'What would you like to Load: `command`(`c`), `inhibitor`(`i`) or `listener`(`l`) ?',
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
    if(mtype === 'command') {
      this.handler.removeAll();
      this.handler.loadAll();
    }
    if(mtype === 'inhibitor') {
      this.client.inhibitorHandler.removeAll();
      this.client.inhibitorHandler.loadAll();
    }
    if(mtype === 'listener') {
      this.client.listenerHandler.removeAll();
      this.client.listenerHandler.loadAll();
    }
    return message.util.reply(`Loaded \`all\` ${mtype}s ✅`);
  }
}

module.exports = LoadCommand;