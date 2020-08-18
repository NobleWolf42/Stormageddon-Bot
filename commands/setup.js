const { canModifyQueue } = require("../internal/settingsFunctions.js");
const { readFileSync } = require('fs');
const { setup } = require("../internal/settingsFunctions.js");
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
const { errorNoServerAdmin, errorCustom } = require("../helpers/embedMessages.js");

module.exports = {
    name: "setup",
    type: ['Gulid'],
    aliases: [""],
    cooldown: 0,
    class: 'admin',
    usage: 'setup',
    description: "Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message) {
        if (!(message.channel.gulid.id in serverConfig)) {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                setup(message);
            }
            else {
                errorNoServerAdmin(message);
            };
        }
        else {
            errorCustom(message, "Server Setup has already been completed.");
        };
        return;
    }
};