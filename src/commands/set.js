//#region Helpers
const {
    errorNoServerAdmin,
    errorCustom,
} = require('../helpers/embedMessages.js');
//#endregion

//#region Internals
const {
    setAutoRole,
    setJoinRole,
    setMusic,
    setGeneral,
    setModMail,
    setJoinToCreateVC,
    setBlame,
} = require('../internal/settingsFunctions.js');
//#endregion

//#region This exports the set command with the information about it
module.exports = {
    name: 'set',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'set autorole/general/joinrole/jointocreatevc/modmail/music',
    description:
        'Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute(message, args, client, distube) {
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
                    errorCustom(
                        message,
                        'Not a valid settings category!',
                        module.name,
                        client
                    );
                    break;
            }
        } else {
            errorNoServerAdmin(message, module.name);
        }
        return;
    },
};
//#endregion
