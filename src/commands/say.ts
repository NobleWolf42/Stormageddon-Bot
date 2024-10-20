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
    execute(message, args, client, _distube, _collections, serverConfig) {
        const channel = message.channel;

        if (channel.isDMBased()) {
            return;
        }

        if (!adminCheck(message.member, serverConfig)) {
            errorNoAdmin(message, this.name);
            return;
        }

        const argsString = args.join(' ');

        if (argsString == '') {
            errorCustom(message, 'Cannot send an empty message!', this.name, client);
            return;
        }

        channel.send(argsString);
        if (!message.deleted) {
            message.delete();
            message.deleted = true;
        }
    },
};
//#endregion

//#region Exports
export default sayCommand;
//#endregion
