var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Import
import { PermissionFlagsBits } from 'discord.js';
import { errorNoServerAdmin, errorCustom } from '../helpers/embedMessages.js';
import { setup } from '../internal/settingsFunctions.js';
//#endregion
//#region This exports the setup command with the information about it
const setupCommand = {
    name: 'setup',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'setup',
    description: 'Fist time set up on a server. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute(message, _args, client, _distube, _collection, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
                errorNoServerAdmin(message, this.name);
            }
            if (!serverConfig.setupNeeded) {
                errorCustom(message, 'Server Setup has already been completed.', this.name, client);
            }
            yield setup(message);
        });
    },
};
//#endregion
//#region Exports
export default setupCommand;
//#endregion
