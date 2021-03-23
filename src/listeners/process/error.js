const { Listener } = require('discord-akairo');
class UnhandledRejectionListener extends Listener {
    constructor() {
        super('unhandledRejection', {
            event: 'unhandledRejection',
            emitter: 'process',
        });
    }

    exec(error) {
        console.error(new Date().toUTCString(), error, error.stack);
    }
}

module.exports = UnhandledRejectionListener;