import { adminCheck } from '../helpers/userPermissions.js';
import { errorNoAdmin, errorCustom } from '../helpers/embedMessages.js';
//#endregion
//#region This exports the say command with the information about it
const sayCommand = {
    name: 'say',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'admin',
    usage: 'say ***MESSAGE-CONTENT***',
    description: 'Sends a message as the bot.',
    execute(message, args, client, distube, collections, serverConfig) {
        const channel = message.channel;
        if (channel.isDMBased()) {
            return;
        }
        if (!adminCheck(message, serverConfig)) {
            errorNoAdmin(message, this.name);
            return;
        }
        const argsString = args.join(' ');
        if (argsString == '') {
            errorCustom(message, 'Cannot send an empty message!', this.name, client);
            return;
        }
        channel.send(argsString);
        message.delete();
        message.deleted = true;
    },
};
//#endregion
//#region Exports
export default sayCommand;
//#endregion
