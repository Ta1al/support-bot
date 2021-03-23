const { Listener } = require('discord-akairo');
var time = new Date();
class cmdErrorListener extends Listener {
  constructor() {
    super('cmderr', {
      emitter: 'commandHandler',
      category: 'commandHandler',
      event: 'error'
    });
  }
  /**
     *
     * @param {Message} msg
     * @param {Command} command
     * @param {object} error
     */
  exec(error, msg, command) {
    console.error(`Message: ${msg.content} ID: ${msg.id}\nUser: ${msg.member ? msg.member.user.tag : msg.author.tag} ID: ${msg.member ? msg.member.user.id : msg.author.id}\nChannel: ${msg.channel.name} ID: ${msg.channel.id}\nCommand: ${command ? command.id : 'N/A'}\nTime: ${time.toString()}`);
    console.error(error.stack);
    msg.reply(`❌ An error occured (\`cmdError\`):\`\`\`js\n${error}\`\`\``).catch();
  }
}

module.exports = cmdErrorListener;