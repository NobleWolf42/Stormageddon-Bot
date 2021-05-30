const { updateConfigFile } = require("../helpers/currentsettings.js");
const { setup } = require("../internal/settingsFunctions.js");
var serverConfig = updateConfigFile();
const { errorNoServerAdmin, errorCustom } = require("../helpers/embedMessages.js");
console.log(serverConfig);

module.exports = {
    name: "setup",
    type: ['Guild'],
    aliases: [""],
    cooldown: 0,
    class: 'admin',
    usage: 'setup',
    description: "Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    async execute(message) {
        console.log(serverConfig[message.channel.guild.id].setupneeded)
        if (serverConfig[message.channel.guild.id].setupneeded) {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                await setup(message);
            }
            else {
                errorNoServerAdmin(message, module.name);
            };
        }
        else {
            errorCustom(message, "Server Setup has already been completed.", module.name);
        };
        return;
    }
};