const { Listener } = require('discord-akairo');
class UnhandledRejectionListener extends Listener {
    constructor() {
        super('UnhandledPromiseRejectionWarning', {
            event: 'UnhandledPromiseRejectionWarning',
            emitter: 'process',
        });
    }

    exec(error) {
        console.warn(new Date().toUTCString(), error, error.stack)
    }
}

module.exports = UnhandledRejectionListener;