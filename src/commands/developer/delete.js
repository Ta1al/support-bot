const { Command } = require('discord-akairo'), fs = require('fs');
class deleteCommand extends Command {
  constructor() {
    super('delete', {
      ownerOnly: true,
      category: 'dev',
      aliases: ['delete'],
      description: {
        content: 'Delete a file via fs',
        usage: 'path',
        examples: ['./src/index.js']
      },
      args: [
        {
          id: 'path',
          prompt: {
            start: 'Provide file path'
          }
        }
      ]
    });
  }


  async exec(msg, { path }) {
    fs.readFile(path, 'utf8', async (err, data) => {
      if(err) return msg.reply(`❌ Could not read!\`\`\`js\n${err}\`\`\``);
      const haste = await this.client.functions.haste(data);
      await msg.author.send(`⚠ Backup of the delete file (\`${path}\`) just in case: ${haste}`);
      fs.unlink(path, err => {
        if(err) return msg.reply(`❌ Could not delete!\`\`\`js\n${err}\`\`\``);
        return msg.reply('✅ File deleted successfulyl!');
      });
    });
  }
}


module.exports = deleteCommand;