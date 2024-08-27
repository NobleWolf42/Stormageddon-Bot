//#region Helpers
const { PermissionFlagsBits } = require('discord.js');
const { updateConfigFile } = require('../helpers/currentSettings.js');
const {
    errorNoServerAdmin,
    errorCustom,
} = require('../helpers/embedMessages.js');
//#endregion

//#region Internals
const { setup } = require('../internal/settingsFunctions.js');
//#endregion

//#region This exports the setup command with the information about it
module.exports = {
    name: 'setup',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'setup',
    description:
        'Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    async execute(message, args, client, distube) {
        //Loads current server config settings
        var serverConfig = updateConfigFile();

        if (serverConfig[message.guild.id].setupNeeded) {
            if (
                message.member.permissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {
                await setup(message);
            } else {
                errorNoServerAdmin(message, module.name);
            }
        } else {
            errorCustom(
                message,
                'Server Setup has already been completed.',
                module.name,
                client
            );
        }
        return;
    },
};
//#endregion
