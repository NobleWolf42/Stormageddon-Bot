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
import { errorNoAdmin, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { buildConfigFile } from '../internal/settingsFunctions.js';
//#endregion
//#region This creates the changeprefix command with the information about it
const changePrefixCommand = {
    name: 'changeprefix',
    type: ['Guild'],
    aliases: [],
    coolDown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: 'Changes the prefix the bot uses in your server. Available Symbols: ```~!$%^&*()_+-=[];\',.{}|:"<>?```',
    execute(message, args, _client, _distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            //Checks to see if user is bot admin
            if (!adminCheck(message, serverConfig)) {
                errorNoAdmin(message, this.name);
                return;
            }
            //Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
            const isSymbol = /[~!$%^&*()_+\-={}[\]|:";'<>?,.]/;
            //Checks to see is the user input is correct
            if (args[0] == undefined || args[0].length != 1 || !isSymbol.test(args[0])) {
                warnCustom(message, 'You must pick ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', this.name);
                return;
            }
            //#endregion
            //#region Main Logic - Takes user input and saves it to config as bot prefix
            serverConfig.prefix = args[0];
            buildConfigFile(serverConfig, message.guildId);
            embedCustom(message, 'Current Prefix:', '#008000', `Current Prefix is ${serverConfig.prefix}`, {
                text: `Requested by ${message.author.tag}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default changePrefixCommand;
//#endregion
