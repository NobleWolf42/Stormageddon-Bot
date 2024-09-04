var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { EmbedBuilder } from 'discord.js';
import { errorCustom } from '../helpers/embedMessages.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion
//#region This creates the log command with the information about it
const logsCommand = {
    name: 'logs',
    type: ['DM'],
    aliases: [''],
    coolDown: 0,
    class: 'developer',
    usage: 'logs',
    description: 'Triggers the bot to send you the log files.',
    execute(message, args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.devIDs.includes(message.author.id)) {
                const embMsg = new EmbedBuilder().setDescription(`Log files attached.`).setTimestamp().setTitle('Logs').setColor('#5D3FD3');
                client.users.send(message.author.id, {
                    embeds: [embMsg],
                    files: [
                        {
                            attachment: './data/errorLog.json',
                            name: 'errorLog.json',
                        },
                        {
                            attachment: './data/log.json',
                            name: 'log.json',
                        },
                    ],
                });
            }
            else {
                addToLog(LogType.Alert, this.name, message.author.tag, 'Direct Message', 'Direct Message', 'Attempted to use dev only command!', client);
                return errorCustom(message, 'You do not have permission to use this command!', this.name, client);
            }
        });
    },
};
//#endregion
//#region Exports
export default logsCommand;
//#endregion
