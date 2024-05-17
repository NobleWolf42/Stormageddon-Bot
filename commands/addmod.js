//#region Helpers
const { updateConfigFile } = require("../helpers/currentSettings.js");
const { errorNoServerAdmin, errorCustom, warnCustom } = require("../helpers/embedMessages.js");
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
        if (message.member.permissions.has('ADMINISTRATOR')) {
            if ((message.channel.guild.id in serverConfig)) {
                if (message.mentions.members.size == 0) {
                    warnCustom(message, "No user input detected, Did you make sure to @ them?", module.name);
                    return;
                }
                console.log(message.mentions.members);
                message.mentions.members.forEach(async (user) => {
                    var serverID = message.channel.guild.id;
                    var array = serverConfig[serverID].modMail.modList;
                    var userFound = false;

                    array.forEach( item => {
                        if (item == user) {
                            userFound = true;
                        }
                    });

                    if (!userFound) {
                        array.push(user.id);
                    } else {
                        warnCustom(message, "User is already a Mod!", module.name);
                        return;
                    }
            
                    var modMail = {};
                    modMail.modList = array;
                    modMail.enable = true;
                    serverConfig[serverID].modMail = modMail;
            
                    await buildConfigFile(serverConfig);
            
                    message.channel.send("Mods Have Been Added!");
            
                    serverConfig = updateConfigFile();
                });
            }
            else {
                errorCustom(message, "Server is not set up with the bot yet!", module.name);
                return;
            }
        }
        else {
            errorNoServerAdmin(message, module.name);
            return;
        }
    }
}
//#endregion
