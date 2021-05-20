const { readFileSync } = require('fs');
const { setup } = require("../internal/settingsFunctions.js");
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
const { errorNoServerAdmin, errorCustom } = require("../helpers/embedMessages.js");

module.exports = {
    name: "setup",
    type: ['Guild'],
    aliases: [""],
    cooldown: 0,
    class: 'admin',
    usage: 'setup',
    description: "Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message) {
        if (serverConfig[message.channel.guild.id] == {"autorole":{"enable":false,"embedMessage":"Not Set Up","embedFooter":"Not Set Up","roles":["Not Set Up"],"reactions":["🎵"]},"joinrole":{"enable":false,"role":"Not Set Up"},"music":{"enable":false,"djRoles":["Not Set Up"],"textChannel":"not-set-up"},"general":{"adminRoles":["Not Set Up"],"modRoles":["Not Set Up"]},"modmail":{"enable":false,"modlist":[]}}) {
            if (message.member.hasPermission('ADMINISTRATOR')) {
                setup(message);
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