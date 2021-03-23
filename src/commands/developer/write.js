const
  { Command } = require('discord-akairo'),
  fetch = require('node-fetch'),
  fs = require('fs');

module.exports = class writeCommand extends Command {
  constructor() {
    super('write', {
      category: 'dev',
      aliases: ['write'],
      description: {
        content: 'Write a file via fs',
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
    
      fs.writeFile(path, data, { encoding: 'utf8', flag: 'wx' }, (err) => {
        if(err) return msg.reply(`❌ Could not write!\`\`\`js\n${err}\`\`\``);
        
        this.handler.removeAll();
        this.handler.loadAll();
        
        this.client.inhibitorHandler.removeAll();
        this.client.inhibitorHandler.loadAll();
        
        this.client.listenerHandler.removeAll();
        this.client.listenerHandler.loadAll();
        return msg.reply('✅ Done!');
      });
    } catch (err) {
      if(err) return msg.reply(`❌ Could not write!\`\`\`js\n${err}\`\`\``);
    }
  }
};
