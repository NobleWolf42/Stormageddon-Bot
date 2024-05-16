//#region Helpers
const { updateConfigFile } = require("../helpers/currentSettings.js");
const { errorNoServerAdmin, errorCustom } = require("../helpers/embedMessages.js");
//##endregion

//#region Internals
const { buildConfigFile } = require("../internal/settingsFunctions.js");
//#endregion

//Gets current config file
var serverConfig = updateConfigFile();

//#region This exports the addmod command with the information about it
module.exports = {
    name: "addmod",
    type: ['Guild'],
    aliases: [""],
    coolDown: 0,
    class: 'admin',
    usage: 'addmod ***MENTION-USERS***',
    description: "Adds users to the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if ((message.channel.guild.id in serverConfig)) {
                message.mentions.members.forEach(async (user) => {
                    var serverID = message.channel.guild.id;
                    var array = serverConfig[serverID].modmail.modlist;
            
                    if (user == undefined) {
                        return;
                    }
                    else {
                        array.push(user.id);
                    }
            
                    var modmail = {};
                    modmail.modlist = array;
                    modmail.enable = true;
                    serverConfig[serverID].modmail = modmail;
            
                    await buildConfigFile(serverConfig);
            
                    message.channel.send("Mods Have Been Added!");
            
                    serverConfig = updateConfigFile();
                });
            }
            else {
                errorCustom(message, "Server is not set up with the bot yet!", module.name);
            }
        }
        else {
            errorNoServerAdmin(message, module.name);
        }
    }
}
//#endregion
