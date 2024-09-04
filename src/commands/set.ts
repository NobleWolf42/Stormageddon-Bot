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
    execute(message, args, client) {
        //Checks to see if the user using the command has administrator privileges in the server where the command is being attempted
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            errorNoServerAdmin(message, this.name);
        }

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
                errorCustom(message, 'Not a valid settings category!', this.name, client);
                break;
        }
    },
};
//#endregion

//#region Exports
export default setCommand;
//#endregion
