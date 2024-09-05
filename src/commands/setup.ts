//#region Import
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom } from '../helpers/embedMessages.js';
import { setup } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the setup command with the information about it
const setupCommand: Command = {
    name: 'setup',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'setup',
    description: 'Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    async execute(message, _args, client, _distube, _collection, serverConfig) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            errorNoServerAdmin(message, this.name);
        }

        if (!serverConfig.setupNeeded) {
            errorCustom(message, 'Server Setup has already been completed.', this.name, client);
        }

        await setup(message);
    },
};
//#endregion

//#region Exports
export default setupCommand;
//#endregion
