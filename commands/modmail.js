//#regions Helpers
const { updateConfigFile } = require("../helpers/currentsettings.js");
const { errorCustom, warnCustom,warnDisabled } = require('../helpers/embedMessages.js');
//#endregion

//#region loads current server config file
var serverConfig = updateConfigFile();
//#endregion

//#region This exports the modmail command with the information about it
module.exports = {
    name: "modmail",
    type: ['DM'],
    aliases: [],
    cooldown: 15,
    class: 'direct',
    usage: '!modmail ***SERVER-NAME***, ***MESSAGE*** ',
    description: "Whisper via Stormageddon to all moderators for the specified server.",
    execute(message, args, client) {
        var argsString = args.join(' ');
        var arguments = argsString.split(', ');
        var serverID = 0;
        var servername = arguments[0];
        var content = arguments[1];
    
        client.guilds.cache.forEach(function (key) {
            if (key.name == servername) {
                serverID = key.id;
            }
        })
    
        if ((serverID != 0) && (serverConfig[serverID] != undefined)) {
            if (serverConfig[serverID].modmail.enable) {
                var modlist = serverConfig[serverID].modmail.modlist;
    
                for (key in modlist) {
                    client.users.cache.get(modlist[key]).send('```' + content + '``` `From - ' + message.author.tag + ' in Server - ' + servername + '.`');
                }
            }
            else {
                warnDisabled(message, 'modmail', module.name);
            }
        }
        else if (serverConfig[serverID] == undefined) {
            errorCustom(message, `The \`!setup\` command has not been run on \`${servername}\` yet.`, module.name);
        }
        else {
            warnCustom(message, 'The server you specified does not have this bot, or you failed to specify a server.', module.name);
        }
    }
}
//#endregion
