//#region Helpers
const { updateConfigFile } = require("../helpers/currentSettings.js");
const { errorNoServerAdmin, errorCustom } = require("../helpers/embedMessages.js");
//#endregion

//#region Internals
const { buildConfigFile } = require("../internal/settingsFunctions.js");
//#endregion

//#region This exports the removemod command with the information about it
module.exports = {
    name: "removemod",
    type: ['Guild'],
    aliases: [""],
    coolDown: 0,
    class: 'admin',
    usage: 'removemod ***MENTION-USERS***',
    description: "Removes users from the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if ((message.channel.guild.id in serverConfig)) {
                message.mentions.members.forEach(async (user) => {
                    var serverID = message.channel.guild.id;
                    var array = serverConfig[serverID].modMail.modList;
            
                    if (user == undefined) {
                        return;
                    }
                    else {
                        array = array.filter(function(value){ return value != user.id;});
                    }
            
                    var modMail = {};
                    modMail.modList = array;
                    modMail.enable = true;
                    serverConfig[serverID].modMail = modMail;
            
                    await buildConfigFile(serverConfig);
            
                    message.channel.send("Mods Have Been Removed!");
            
                    serverConfig = updateConfigFile();
                });
            }
            else {
                errorCustom(message, "Server is not set up with the bot yet!", module.name)
            }
        }
        else {
            errorNoServerAdmin(message, module.name);
        }
    }
}
//#endregion
