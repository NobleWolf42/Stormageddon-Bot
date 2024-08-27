//#region Dependencies
var _a = require('fs'), readFileSync = _a.readFileSync, writeFileSync = _a.writeFileSync;
//#endregion
//#region Data Files
var prefixFile = JSON.parse(readFileSync('./data/botPrefix.json'));
//#endregion
//#region Helpers
var _b = require('../helpers/embedMessages.js'), errorNoAdmin = _b.errorNoAdmin, warnCustom = _b.warnCustom, embedCustom = _b.embedCustom, errorCustom = _b.errorCustom;
var adminCheck = require('../helpers/userPermissions.js').adminCheck;
//#endregion
//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
var isSymbol = /[~!$%^&*()_+\-={}[\]\|:";'<>?,.]/;
//#region This exports the changeprefix command with the information about it
module.exports = {
    name: 'changeprefix',
    type: ['Guild'],
    aliases: [],
    coolDown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: 'Changes the prefix the bot uses in your server. Available Symbols: ```~!$%^&*()_+-=[];\',.{}|:"<>?```',
    execute: function (message, args, client, distube) {
        var serverID = message.guild.id;
        if (adminCheck(message)) {
            if (args[0] != undefined) {
                if (args[0].length == 1 && isSymbol.test(args[0])) {
                    prefixFile[serverID] = { prefix: args[0] };
                    writeFileSync('./data/botPrefix.json', JSON.stringify(prefixFile), function (err) {
                        if (err) {
                            return errorCustom(message, err.description, module.name, client);
                        }
                    });
                    return embedCustom(message, 'Current Prefix:', '#008000', "Current Prefix is ".concat(args[0]), {
                        text: "Requested by ".concat(message.author.tag),
                        iconURL: null,
                    }, null, [], null, null);
                }
                else {
                    return warnCustom(message, 'Bot Prefix Must be ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', module.name);
                }
            }
            else {
                return warnCustom(message, 'You must define a bot prefix.', module.name);
            }
        }
        else {
            return errorNoAdmin(message, module.name);
        }
    },
};
//#endregion
