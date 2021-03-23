const
  { Command } = require('discord-akairo'),
  fetch = require('node-fetch'),
  fs = require('fs');

module.exports = class editCommand extends Command {
  constructor() {
    super('edit', {
      category: 'dev',
      aliases: ['edit', 'overwrite'],
      description: {
        content: 'Overwrite a file via fs',
        usage: '<path> <rawHastebinLink>',
        examples: [
          './src/commands/test.js https://hastebin.com/raw/kefofuniku'
        ]
      },
      args: [
        {
          id: 'path',
          prompt: {
            start: 'Enter file path'
          }
        },
        {
          id: 'link',
          prompt: {
            start: 'Enter hastebin link (raw)'
          }
        }
      ],
      ownerOnly: true
    });
  }


  async exec(msg, { path, link }) {
    try {
      const res = await fetch(link);
      const data = await res.buffer();
    
      fs.readFile(path, 'utf8', async (err, data) => {
        if(err) return msg.reply(`❌ Could not read!\`\`\`js\n${err}\`\`\``);
        const haste = await this.client.functions.haste(data);
        msg.author.send(`⚠ Backup of the edited file (\`${path}\`) just in case: ${haste}`);
      });
      fs.writeFile(path, data, { encoding: 'utf8' }, (err) => {
        if(err) return msg.reply(`❌ Could not edit!\`\`\`js\n${err}\`\`\``);
        
        this.handler.removeAll();
        this.handler.loadAll();
        
        this.client.inhibitorHandler.removeAll();
        this.client.inhibitorHandler.loadAll();
        
        this.client.listenerHandler.removeAll();
        this.client.listenerHandler.loadAll();
        return msg.reply('✅ Done!');
      });
    } catch (err) {
      if(err) return msg.reply(`❌ Could not edit!\`\`\`js\n${err}\`\`\``);
    }
  }
};
