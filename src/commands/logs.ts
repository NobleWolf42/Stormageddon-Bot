//#region Imports
import { EmbedBuilder } from 'discord.js';
import { errorCustom } from '../helpers/embedMessages.js';
import { addToLog } from '../helpers/errorLog.js';
import { Command } from '../models/commandModel.js';
import { LogType } from '../models/loggingModel.js';
//#endregion

//#region This creates the log command with the information about it
const logsCommand: Command = {
    name: 'logs',
    type: ['DM'],
    aliases: [''],
    coolDown: 0,
    class: 'developer',
    usage: 'logs',
    description: 'Triggers the bot to send you the log files.',
    async execute(message, _args, client) {
        //#region Escape Conditionals
        if (!process.env.devIDs.split(',').includes(message.author.id)) {
            addToLog(LogType.Alert, this.name, message.author.tag, 'Direct Message', 'Direct Message', 'Attempted to use dev only command!', client);
            return errorCustom(message, 'You do not have permission to use this command!', this.name, client);
        }
        //#endregion

        //#region Main Logic - Send the log files as attachments to the dev
        const embMsg = new EmbedBuilder().setDescription(`Log files attached.`).setTimestamp().setTitle('Logs').setColor('#5D3FD3');

        client.users.send(message.author.id, {
            embeds: [embMsg],
            files: [
                {
                    attachment: '../../data/errorLog.json',
                    name: 'errorLog.json',
                },
                {
                    attachment: '../data/log.json',
                    name: 'log.json',
                },
            ],
        });
        //#endregion
    },
};
//#endregion

//#region Exports
export default logsCommand;
//#endregion
