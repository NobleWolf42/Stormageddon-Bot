//Work in progrees to make buttons do the heavy lifting
//#region Helpers
const { updateConfigFile } = require('../../helpers/currentSettings.js');
const { errorCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion

//#region Internals
const { setup } = require('../../internal/settingsFunctions.js');
//#endregion

//#region This exports the setup command with the information about it
module.exports = {
    data: new SlashCommandBuilder().setName('setup').setDescription('Fist time set up on a server.').setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(message, args, client, distube) {
        //Loads current server config settings
        var serverConfig = updateConfigFile();

        if (serverConfig[message.guild.id].setupNeeded) {
            if (message.member.permissions.has('ADMINISTRATOR')) {
                await setup(message);
            } else {
                errorNoServerAdmin(message, module.name);
            }
        } else {
            errorCustom(message, 'Server Setup has already been completed.', module.name, client);
        }
        return;
    },
};
//#endregion
