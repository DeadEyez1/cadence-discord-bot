import { Events, Guild, Message, User } from 'discord.js';
import { replacements } from '../../replacement';
import { randomUUID as uuidv4 } from 'node:crypto';
import loggerService, { Logger } from '../../common/services/logger';

module.exports = {
    name: Events.MessageCreate,
    isDebug: false,
    once: false,
    execute: async (message: Message, guild: Guild) => {
        const executionId: string = uuidv4();
        const logger: Logger = loggerService.child({
            module: 'event',
            name: 'messageCreate',
            executionId: executionId
        });

        if (message.author.bot) {
            return;
        }

        let reply = '';
        const replacementsEntries = Object.entries(replacements);
        for (const [identifier, replacer] of replacementsEntries) {
            const regex = RegExp(identifier);

            if (regex.test(message.content)) {
                const result = replacer(message.content.replaceAll('|', ''));

                if (result) {
                    reply += `${result}`;
                }
            }
        }

        if (reply === '') {
            return;
        }

        if (message.content.includes('||')) {
            reply = `||${reply.replace(/\n$/g, '')} ||`;
        }

        await message
            .reply({ content: reply, allowedMentions: { repliedUser: false } })
            .then(() => {
                message.suppressEmbeds(true).catch((err) => {
                    const errMsg: string = (err as Error).message;

                    if (errMsg.includes('Missing Permissions')) {
                        return;
                    }

                    logger.warn(`Failed to suppress embeds: ${(err as Error).message}`, 'Events.MessageCreate');
                });
            })
            .catch((err) => {
                const errMsg: string = (err as Error).message;

                if (errMsg.includes('Missing Permissions')) {
                    return;
                }

                logger.warn(`Failed to reply: ${(err as Error).message}`, 'Events.MessageCreate');
            });
    }
};
