const fs = require('node:fs');
const path = require('node:path');
const logger = require(path.resolve('./src/services/logger.js'));
require('dotenv').config();

exports.registerEventListeners = (client, player) => {
    const eventFolders = fs.readdirSync(path.resolve('./src/events'));
    for (const folder of eventFolders) {
        const eventFiles = fs
            .readdirSync(path.resolve(`./src/events/${folder}`))
            .filter((file) => file.endsWith('.js'));

        for (const file of eventFiles) {
            const event = require(path.resolve(`./src/events/${folder}/${file}`));
            switch (folder) {
                case 'client':
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        if (
                            !event.isDebug ||
                            process.env.NODE_ENV === 'development' ||
                            process.env.MINIMUM_LOG_LEVEL === 'debug'
                        ) {
                            client.on(event.name, (...args) => event.execute(...args));
                        }
                    }
                    break;

                case 'interactions':
                    client.on(event.name, (...args) => event.execute(...args, { client }));
                    break;

                case 'process':
                    process.on(event.name, (...args) => event.execute(...args));
                    break;

                case 'player':
                    if (
                        !event.isDebug ||
                        process.env.NODE_ENV === 'development' ||
                        process.env.MINIMUM_LOG_LEVEL === 'debug'
                    ) {
                        if (event.isPlayerEvent) {
                            player.events.on(event.name, (...args) => event.execute(...args));
                            break;
                        } else {
                            player.on(event.name, (...args) => event.execute(...args));
                        }
                    }
                    break;

                default:
                    logger.error(`Unknown event folder '${folder}' while trying to register events.`);
            }
        }
    }
};
