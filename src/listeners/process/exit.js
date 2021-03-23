const { Listener } = require('discord-akairo');
const time = new Date();
class UnhandledRejectionListener extends Listener {
    constructor() {
        super('exit', {
            event: 'exit',
            emitter: 'process',
        });
    }

    exec(code) {
        code !== 0 ? console.error(`Shutting down with exit code: ${code} at ${time.toUTCString()}`) : console.log(`Shutting down with exit code: ${code} at ${time.toUTCString()}`);
    }
}

module.exports = UnhandledRejectionListener;