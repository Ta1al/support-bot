const { Command } = require('discord-akairo'), fs = require('fs');
class readCommand extends Command {
  constructor() {
    super('read', {
      ownerOnly: true,
      category: 'dev',
      aliases: ['read'],
      description: {
        content: 'Read a file and get its content via fs.',
        usage: '<path>',
        examples: ['./src/index.js']
      },
      args: [
        {
          id: 'path',
          prompt: {
            start: 'Enter file path'
          }
        }
      ]
    });
  }

  async exec(msg, { path }) {
    fs.readFile(path, 'utf8', async (err, data) => {
      if(err) return msg.reply(`❌ Could not read!\`\`\`js\n${err}\`\`\``);
      const haste = await this.client.functions.haste(data);
      msg.channel.send(haste);
    });
  }
}


module.exports = readCommand;