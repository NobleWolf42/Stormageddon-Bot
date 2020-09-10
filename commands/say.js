//#region Dependancies
const { adminCheck } = require('../helpers/userHandling.js');
const { errorNoAdmin, errorCustom } = require('../helpers/embedMessages.js');
const { addToLog } = require('../helpers/errorlog.js');
//#endregion

//#region say command
module.exports = {
    name: "say",
    type: ['Guild'],
    aliases: [],
    cooldown: 0,
    class: 'admin',
    usage: 'say ***MESSAGE-CONTENT***',
    description: "Sends messege as bot.",
    execute(message, args, client) {
        if (adminCheck(message)) {
            try {
                var argsString = args.join(' ');
                
                if (argsString != '') {
                    message.channel.send(argsString);
                }
                else {
                    errorCustom(message, "Cannot send an empty message!", module.name);
                }
                message.delete();
            }
            catch (error) {
                addToLog('Fatal Error', module.name, message.author.tag, message.guild.name, message.channel.name, error, client);
            }
        }
        else {
            errorNoAdmin(message, module.name);
        }
    }
}
//#endregion