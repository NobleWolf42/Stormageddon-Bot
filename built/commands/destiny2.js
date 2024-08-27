//#region Dependencies
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//#endregion
//#region Helpers
var _a = require('../helpers/embedMessages.js'), embedCustom = _a.embedCustom, warnCustom = _a.warnCustom, errorCustom = _a.errorCustom;
//#endregion
//#region This exports the destiny2 command with the information about it
module.exports = {
    name: 'destiny2',
    type: ['DM', 'Guild'],
    aliases: ['d2'],
    coolDown: 0,
    class: 'gaming',
    usage: 'destiny2 clan ***INSERT-CLAN-NAME***',
    description: "Displays Destiny 2 clan's bio, avatar, motto, and founder. (Works in Direct Messages too.)",
    execute: function (message, args, client, distube) {
        if (args[0] == 'clan') {
            var clanName = '';
            for (i = 1; i < args.length; i++) {
                if (i != args.length - 1) {
                    clanName += "".concat(args[i], " ");
                }
                else {
                    clanName += "".concat(args[i]);
                }
            }
            getClan(message, clanName);
        }
        else {
            return warnCustom(message, "You did not use the command correctly, please try again (".concat(message.prefix, "destiny2 clan ***INSERT-CLAN-NAME***)."), module.name);
        }
    },
};
//#endregion
//#region Gets the information of the destiny 2 clan by name
function getClan(message, clan_name) {
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
                return embedCustom(message, "".concat(clan_name, " Clan Information"), '#F5F5F5', "The clan was created on ".concat(data['detail']['creationDate'], ".\n The founder is ").concat(data['founder']['bungieNetUserInfo']['displayName'], ".\n\n ").concat(data['detail']['about']), {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, attachment, [], null, null);
            }
            else {
                return warnCustom(message, "The Search for `".concat(clan_name, "` returned no results.\n Try something else."), module.name);
            }
        }
        else if (error.ErrorStatus == 'ClanNotFound') {
            return warnCustom(message, "The Search for `".concat(clan_name, "` returned no results.\n Try something else."), module.name);
        }
        else {
            return errorCustom(message, 'The Destiny API was unable to be reached at this time.\n Try again later.', module.name, client);
        }
    };
    request.send();
}
//#endregion
