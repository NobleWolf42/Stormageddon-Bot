var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { embedCustom, warnCustom, errorCustom } from '../helpers/embedMessages.js';
//#endregion
//#region This creates the destiny2 command with the information about it
const destiny2Command = {
    name: 'destiny2',
    type: ['DM', 'Guild'],
    aliases: ['d2'],
    coolDown: 0,
    class: 'gaming',
    usage: 'destiny2 clan ***INSERT-CLAN-NAME***',
    description: "Displays Destiny 2 clan's bio, avatar, motto, and founder. (Works in Direct Messages too.)",
    execute(message, args, client, distube, collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (args[0] == 'clan') {
                var clanName = '';
                for (let i = 1; i < args.length; i++) {
                    if (i != args.length - 1) {
                        clanName += `${args[i]} `;
                    }
                    else {
                        clanName += `${args[i]}`;
                    }
                }
                getClan(message, clanName, this.name, client);
            }
            else {
                return warnCustom(message, `You did not use the command correctly, please try again (${serverConfig.prefix}destiny2 clan ***INSERT-CLAN-NAME***).`, this.name);
            }
        });
    },
};
//#endregion
//#region Gets the information of the destiny 2 clan by name
function getClan(message, clan_name, name, client) {
    // Request initialized and created
    var request = new XMLHttpRequest();
    request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/' + clan_name + '/1', true);
    request.setRequestHeader('X-API-KEY', process.env.d2ApiKey);
    request.onload = function () {
        // After request is received, parse it.
        var data = JSON.parse(request.responseText)['Response'];
        var error = JSON.parse(request.responseText);
        if (request.status >= 200 && request.status < 400) {
            if (data != null && data != undefined) {
                var domain = 'https://www.bungie.net/';
                var attachment = domain + data['founder']['bungieNetUserInfo']['iconPath'];
                return embedCustom(message, `${clan_name} Clan Information`, '#F5F5F5', `The clan was created on ${data['detail']['creationDate']}.\n The founder is ${data['founder']['bungieNetUserInfo']['displayName']}.\n\n ${data['detail']['about']}`, {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                }, attachment, [], null, null);
            }
            else {
                return warnCustom(message, `The Search for \`${clan_name}\` returned no results.\n Try something else.`, name);
            }
        }
        else if (error.ErrorStatus == 'ClanNotFound') {
            return warnCustom(message, `The Search for \`${clan_name}\` returned no results.\n Try something else.`, name);
        }
        else {
            return errorCustom(message, 'The Destiny API was unable to be reached at this time.\n Try again later.', name, client);
        }
    };
    request.send();
}
//#endregion
//#region Exports
export default destiny2Command;
//#endregion
