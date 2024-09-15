//#region Imports
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom } from '../helpers/embedMessages.js';
import { setAutoRole, setJoinRole, setMusic, setGeneral, setModMail, setJoinToCreateVC, setBlame } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the set command with the information about it
const setCommand: Command = {
    name: 'set',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'set autorole/general/joinrole/jointocreatevc/modmail/music',
    description: 'Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    async execute(message, args, client, _distube, _collections, serverConfig) {
        //Checks to see if the user using the command has administrator privileges in the server where the command is being attempted
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            errorNoServerAdmin(message, this.name);
        }

        switch (args[0]) {
            case 'autorole':
                await setAutoRole(message, serverConfig, client);
                break;

            case 'joinrole':
                await setJoinRole(message, serverConfig);
                break;

            case 'general':
                await setGeneral(message, serverConfig);
                break;

            case 'music':
                await setMusic(message, serverConfig);
                break;

            case 'modmail':
                await setModMail(message, serverConfig);
                break;

            case 'jointocreatevc':
                await setJoinToCreateVC(message, serverConfig);
                break;

            case 'blame':
                await setBlame(message, serverConfig);
                break;

            default:
                errorCustom(message, 'Not a valid settings category!', this.name, client);
                break;
        }
    },
};
//#endregion

//#region Exports
export default setCommand;
//#endregion
