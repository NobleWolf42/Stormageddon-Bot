//#region Helpers
var _a = require('../helpers/embedMessages.js'), errorNoServerAdmin = _a.errorNoServerAdmin, errorCustom = _a.errorCustom;
//#endregion
//#region Internals
var _b = require('../internal/settingsFunctions.js'), setAutoRole = _b.setAutoRole, setJoinRole = _b.setJoinRole, setMusic = _b.setMusic, setGeneral = _b.setGeneral, setModMail = _b.setModMail, setJoinToCreateVC = _b.setJoinToCreateVC, setBlame = _b.setBlame;
//#endregion
//#region This exports the set command with the information about it
module.exports = {
    name: 'set',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'set autorole/general/joinrole/jointocreatevc/modmail/music',
    description: 'Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute: function (message, args, client, distube) {
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            switch (args[0]) {
                case 'autorole':
                    setAutoRole(message);
                    break;
                case 'joinrole':
                    setJoinRole(message);
                    break;
                case 'general':
                    setGeneral(message);
                    break;
                case 'music':
                    setMusic(message);
                    break;
                case 'modmail':
                    setModMail(message);
                    break;
                case 'jointocreatevc':
                    setJoinToCreateVC(message);
                    break;
                case 'blame':
                    setBlame(message);
                    break;
                default:
                    errorCustom(message, 'Not a valid settings category!', module.name, client);
                    break;
            }
        }
        else {
            errorNoServerAdmin(message, module.name);
        }
        return;
    },
};
//#endregion
