var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { adminCheck } from '../helpers/userPermissions.js';
import { errorNoAdmin, errorCustom } from '../helpers/embedMessages.js';
//#endregion
//#region This exports the say command with the information about it
const sayCommand = {
    name: 'say',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'admin',
    usage: 'say ***MESSAGE-CONTENT***',
    description: 'Sends a message as the bot.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.channel;
            if (channel.isDMBased()) {
                return;
            }
            if (adminCheck(message)) {
                var argsString = args.join(' ');
                if (argsString != '') {
                    channel.send(argsString);
                }
                else {
                    return errorCustom(message, 'Cannot send an empty message!', module.name, client);
                }
                message.delete();
                message.deleted = true;
            }
            else {
                return errorNoAdmin(message, module.name);
            }
        });
    },
};
//#endregion
//#region Exports
export default sayCommand;
//#endregion
