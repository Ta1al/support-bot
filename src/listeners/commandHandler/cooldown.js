const { Listener } = require('discord-akairo');

class CooldownListener extends Listener {
  constructor() {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler'
    });
  }

  exec(message, command, remaining) {
    const time = remaining / 1000;

    message.reply(`You can use that command again in ${time} seconds.`).catch();
  }
}

module.exports = CooldownListener;