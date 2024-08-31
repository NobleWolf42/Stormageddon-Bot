var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Helpers
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { errorNoServerAdmin, errorCustom, embedCustom, } = require('../helpers/embedMessages.js');
//#endregion
//#region Internals
const { buildConfigFile } = require('../internal/settingsFunctions.js');
//#endregion
//#region This exports the removemod command with the information about it
module.exports = {
    name: 'removemod',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'admin',
    usage: 'removemod ***MENTION-USERS***',
    description: 'Removes users from the list of people that get the PM when someone whispers the bot with the !modmail command. MUST HAVE SERVER ADMINISTRATOR STATUS.',
    execute(message, args, client, distube) {
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            if (message.channel.guild.id in serverConfig) {
                if (message.mentions.members.size == 0) {
                    return warnCustom(message, 'No user input detected, Did you make sure to @ them?', module.name);
                }
                message.mentions.members.forEach((user) => __awaiter(this, void 0, void 0, function* () {
                    var serverID = message.channel.guild.id;
                    var array = serverConfig[serverID].modMail.modList;
                    var userFound = false;
                    array.forEach((item) => {
                        if (item == user) {
                            userFound = true;
                        }
                    });
                    if (userFound) {
                        array = array.filter(function (value) {
                            return value != user.id;
                        });
                    }
                    else {
                        return warnCustom(message, `User ${user.tag} is not a Mod!`, module.name);
                    }
                    var modMail = {};
                    modMail.modList = array;
                    modMail.enable = true;
                    serverConfig[serverID].modMail = modMail;
                    yield buildConfigFile(serverConfig);
                    embedCustom(message, 'Mods Removed', '#5D3FD3', `Mods have been successfully removed!`, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                    serverConfig = updateConfigFile();
                }));
            }
            else {
                return (errorCustom(message, 'Server is not set up with the bot yet!', module.name),
                    client);
            }
        }
        else {
            return errorNoServerAdmin(message, module.name);
        }
    },
};
export {};
//#endregion
