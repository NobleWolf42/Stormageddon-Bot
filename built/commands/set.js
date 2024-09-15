var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom } from '../helpers/embedMessages.js';
import { setAutoRole, setJoinRole, setMusic, setGeneral, setModMail, setJoinToCreateVC, setBlame } from '../internal/settingsFunctions.js';
//#endregion
//#region This creates the set command with the information about it
const setCommand = {
    name: 'set',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'set autorole/general/joinrole/jointocreatevc/modmail/music',
    description: 'Allows you to change the settings you set during setup. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute(message, args, client, _distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            //Checks to see if the user using the command has administrator privileges in the server where the command is being attempted
            if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                errorNoServerAdmin(message, this.name);
            }
            switch (args[0]) {
                case 'autorole':
                    yield setAutoRole(message, serverConfig, client);
                    break;
                case 'joinrole':
                    yield setJoinRole(message, serverConfig);
                    break;
                case 'general':
                    yield setGeneral(message, serverConfig);
                    break;
                case 'music':
                    yield setMusic(message, serverConfig);
                    break;
                case 'modmail':
                    yield setModMail(message, serverConfig);
                    break;
                case 'jointocreatevc':
                    yield setJoinToCreateVC(message, serverConfig);
                    break;
                case 'blame':
                    yield setBlame(message, serverConfig);
                    break;
                default:
                    errorCustom(message, 'Not a valid settings category!', this.name, client);
                    break;
            }
        });
    },
};
//#endregion
//#region Exports
export default setCommand;
//#endregion
