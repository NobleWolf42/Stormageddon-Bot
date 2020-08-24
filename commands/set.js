const { setAutorole, setJoinrole, setMusic, setGeneral, setModMail } = require("../internal/settingsFunctions.js");
const { errorNoServerAdmin, errorCustom } = require("../helpers/embedMessages.js");

module.exports = {
    name: "set",
    type: ['Guild'],
    aliases: [""],
    cooldown: 0,
    class: 'admin',
    usage: 'set autorole/joinrole/general/music/modmail',
    description: "Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.",
    execute(message, args) {
        if (message.member.hasPermission('ADMINISTRATOR')) {
            if (args[0] == 'autorole') {
                setAutorole(message);
            }
            else if (args[0] == 'joinrole') {
                setJoinrole(message);
            }
            else if (args[0] == 'general') {
                setGeneral(message);
            }
            else if (args[0] == 'music') {
                setMusic(message);
            }
            else if (args[0] == 'modmail') {
                setModMail(message);
            }
            else {
                errorCustom(message, "Not a valid settings catagory!", module.name);
            }
        }
        else {
            errorNoServerAdmin(message, module.name);
        };
        return;
    }
};