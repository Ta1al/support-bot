const { Listener } = require('discord-akairo');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    console.log(`${this.client.user.tag} is ready to serve!`);
  }
}

module.exports = ReadyListener;