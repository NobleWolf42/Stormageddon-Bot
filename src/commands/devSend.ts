//#regions Import
import { EmbedBuilder } from 'discord.js';
import { errorCustom, embedCustom } from '../helpers/embedMessages.js';
import { addToLog } from '../helpers/errorLog.js';
import { Command } from '../models/commandModel.js';
import { LogType } from '../models/loggingModel.js';
//#endregion

//#region This creates the devsend command with the information about it
const devSendCommand: Command = {
    name: 'devsend',
    type: ['DM'],
    aliases: [],
    coolDown: 0,
    class: 'developer',
    usage: '!devsend ***USER-ID***, ***MESSAGE***',
    description: 'Developer-only command for sending messages as the bot. (Only works in Direct Message.)',
    async execute(message, args, client) {
        const newArgs = args.join(' ').split(', ');
        const user = newArgs[0];
        const content = newArgs[1];

        if (content == undefined) {
            errorCustom(message, 'Use the , in-between the UserID and message dingus!', this.name, client);
            return;
        }

        if (process.env.devIDs.includes(message.author.id)) {
            const embMsg = new EmbedBuilder()
                .setTitle('Message from Developers')
                .setColor('#0B6E29')
                .setDescription(content)
                .setFooter({
                    text: 'NOTE: You cannot respond to this message.',
                    iconURL: null,
                })
                .setTimestamp();

            client.users.send(user, { embeds: [embMsg] });

            embedCustom(
                message,
                'Message Sent.',
                '#0B6E29',
                `**Message:** \`${content}\` \n**Sent To:** \`${client.users.cache.get(user).tag}\``,
                { text: `Requested by ${message.author.tag}`, iconURL: null },
                null,
                [],
                null,
                null
            );
        } else {
            addToLog(LogType.Alert, this.name, message.author.tag, 'Direct Message', 'Direct Message', 'Attempted to use dev only command!', client);
            errorCustom(message, 'You do not have permission to use this command!', this.name, client);
        }
    },
};
//#endregion

//#region Exports
export default devSendCommand;
//#endregion
