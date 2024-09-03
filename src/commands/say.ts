//#region Imports
import { Command } from '../models/commandModel.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { errorNoAdmin, errorCustom } from '../helpers/embedMessages.js';
//#endregion

//#region This exports the say command with the information about it
const sayCommand: Command = {
    name: 'say',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'admin',
    usage: 'say ***MESSAGE-CONTENT***',
    description: 'Sends a message as the bot.',
    async execute(message, args, client, distube) {
        const channel = message.channel;

        if (channel.isDMBased()) {
            return;
        }

        if (adminCheck(message)) {
            var argsString = args.join(' ');

            if (argsString != '') {
                channel.send(argsString);
            } else {
                return errorCustom(message, 'Cannot send an empty message!', module.name, client);
            }
            message.delete();
            message.deleted = true;
        } else {
            return errorNoAdmin(message, module.name);
        }
    },
};
//#endregion

//#region Exports
export default sayCommand;
//#endregion
