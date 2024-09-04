var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#regions Import
import { EmbedBuilder } from 'discord.js';
import { errorCustom, embedCustom } from '../helpers/embedMessages.js';
import { addToLog } from '../helpers/errorLog.js';
import { LogType } from '../models/loggingModel.js';
//#endregion
//#region This creates the devsend command with the information about it
const devSendCommand = {
    name: 'devsend',
    type: ['DM'],
    aliases: [],
    coolDown: 0,
    class: 'developer',
    usage: '!devsend ***USER-ID***, ***MESSAGE***',
    description: 'Developer-only command for sending messages as the bot. (Only works in Direct Message.)',
    execute(message, args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            var argsString = args.join(' ');
            var newArgs = argsString.split(', ');
            var user = newArgs[0];
            var content = newArgs[1];
            if (content == undefined) {
                return errorCustom(message, 'Use the , in-between the UserID and message dingus!', this.name, client);
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
                embedCustom(message, 'Message Sent.', '#0B6E29', `**Message:** \`${content}\` \n**Sent To:** \`${client.users.cache.get(user).username}\``, { text: `Requested by ${message.author.username}`, iconURL: null }, null, [], null, null);
            }
            else {
                addToLog(LogType.Alert, this.name, message.author.username, 'Direct Message', 'Direct Message', 'Attempted to use dev only command!', client);
                errorCustom(message, 'You do not have permission to use this command!', this.name, client);
            }
        });
    },
};
//#endregion
//#region Exports
export default devSendCommand;
//#endregion
