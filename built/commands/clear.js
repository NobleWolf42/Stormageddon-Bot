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
import { errorCustom, embedCustom, warnCustom, errorNoMod } from '../helpers/embedMessages.js';
import { modCheck } from '../helpers/userPermissions.js';
//#endregion
//#region This creates the clear command with the information about it
const clearCommand = {
    name: 'clear',
    type: ['Guild'],
    aliases: ['clr', 'delete', 'clean'],
    coolDown: 0,
    class: 'admin',
    usage: 'clear ***NUMBER(2-99)***',
    description: 'Bulk deletes the previous messages in a chat based on user input, up to 99 previous messages.',
    execute(message, args, client, _distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.channel;
            const amount = parseInt(args[0]);
            //#region Escape Logic
            //Check to see is message was sent in a guild
            if (channel.isDMBased()) {
                return;
            }
            //Checks to see if user is bot mod
            if (!modCheck(message, serverConfig)) {
                errorNoMod(message, this.name);
                return;
            }
            //Checks to see if user input is correct
            if (isNaN(amount) || amount < 2 || amount > 99) {
                warnCustom(message, `${args[0]} is an invalid number! __**Number must be between 1 and 100!**__`, this.name);
                return;
            }
            message.delete();
            message.deleted = true;
            channel
                .bulkDelete(amount)
                .then(() => {
                embedCustom(message, 'Success!', '#008000', `Successfully deleted ${amount} messages!`, {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                }, null, [], null, null);
            })
                .catch((err) => {
                if (err.message == 'You can only bulk delete messages that are under 14 days old.') {
                    warnCustom(message, `You can only bulk delete messages that are under 14 days old.`, this.name);
                    return;
                }
                else {
                    errorCustom(message, `An error occurred while attempting to delete! ${err.message}`, this.name, client);
                    return;
                }
            });
        });
    },
};
//#endregion
//#region Exports
export default clearCommand;
//#endregion
