const { Command } = require('discord-akairo');

class RemoveCommand extends Command {
  constructor() {
    super('removeall', {
      aliases: ['removeall', 'ua', 'unloadall'],
      category: 'dev',
      description: {
        content: 'Remove all the commands/inhibitors/listeners',
        note: 'If no argument is provided, all commands are removed.',
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
        start: 'What would you like to Remove: `command`(`c`), `inhibitor`(`i`) or `listener`(`l`) ?',
        retry: 'You can only choose from `command`(`c`), `inhibitor`(`i`) or `listener`(`l`)',
        optional: true
      },
      default: 'command',
      unordered: true
    };
    return { mtype };
  }

    
  async exec(message, { mtype }) {
    if(mtype === 'command') this.handler.removeAll();
    if(mtype === 'inhibitor') this.client.inhibitorHandler.removeAll();
    if(mtype === 'listener') this.client.listenerHandler.removeAll();
    return message.util.reply(`Removed \`all\` ${mtype}s ✅`);
  }
}

module.exports = RemoveCommand;