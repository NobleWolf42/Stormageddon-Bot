//#region Helpers
const { adminCheck } = require('../helpers/userPermissions.js');
const { errorNoAdmin, errorCustom } = require('../helpers/embedMessages.js');
//#endregion
//#region This exports the say command with the information about it
module.exports = {
    name: 'say',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'admin',
    usage: 'say ***MESSAGE-CONTENT***',
    description: 'Sends a message as the bot.',
    execute(message, args, client, distube) {
        if (adminCheck(message)) {
            var argsString = args.join(' ');
            if (argsString != '') {
                message.channel.send(argsString);
            }
            else {
                return errorCustom(message, 'Cannot send an empty message!', module.name, client);
            }
            message.delete();
            message.deleted = true;
        }
        else {
            return errorNoAdmin(message, module.name);
        }
    },
};
//#endregion
