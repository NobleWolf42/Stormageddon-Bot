//#region Helpers
const { adminCheck } = require('../helpers/userHandling.js');
const { errorNoAdmin, errorCustom } = require('../helpers/embedMessages.js');
//#endregion

//#region This exports the say command with the information about it
module.exports = {
    name: "say",
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'admin',
    usage: 'say ***MESSAGE-CONTENT***',
    description: "Sends messege as bot.",
    execute(message, args, client) {
        if (adminCheck(message)) {
            var argsString = args.join(' ');
                
            if (argsString != '') {
                message.channel.send(argsString);
            }
            else {
                errorCustom(message, "Cannot send an empty message!", module.name);
            }
            message.delete({ timeout: 1500, reason: 'Cleanup.' });
        }
        else {
            errorNoAdmin(message, module.name);
        }
    }
}
//#endregion
