const { Listener } = require('discord-akairo'), config = require('../../config.json');

class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready'
    });
  }

  exec() {
    console.log(`${this.client.user.tag} is ready to serve!`);
    this.client.user.setPresence(config.readyPresence);
  }
}

module.exports = ReadyListener;