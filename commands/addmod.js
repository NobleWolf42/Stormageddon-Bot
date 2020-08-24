const { bulidConfigFile } = require("../internal/settingsFunctions.js");
const { updateConfigFile } = require("../helpers/currentsettings.js");
const { errorNoServerAdmin } = require("../helpers/embedMessages.js");

module.exports = {
    name: "addmod",
    type: ['Gulid'],
    aliases: [""],
    cooldown: 0,
    class: 'admin',
    usage: 'addmod ***MENTION-USERS***',
    description: "Adds users to the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message) {
        if (!(message.channel.gulid.id in serverConfig)) {
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
        
                await bulidConfigFile();
        
                message.channel.send("Mods Have Been Added!");
        
                config = updateConfigFile();
                return config;
            });
        }
        else {
            errorNoServerAdmin(message);
        }
    }
};