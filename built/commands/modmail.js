var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
const { EmbedBuilder } = require('discord.js');
//#endregion
//#regions Helpers
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { errorCustom, warnCustom, warnDisabled, } = require('../helpers/embedMessages.js');
//#endregion
//#region This exports the modmail command with the information about it
module.exports = {
    name: 'modmail',
    type: ['DM'],
    aliases: [],
    coolDown: 15,
    class: 'direct',
    usage: '!modmail ***SERVER-NAME***, ***MESSAGE*** ',
    description: 'Whisper via Stormageddon to all moderators for the specified server.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Gets current config file
            var serverConfig = updateConfigFile();
            var argsString = args.join(' ');
            var arguments = argsString.split(', ');
            var serverID = 0;
            var servername = arguments[0];
            var content = arguments[1];
            client.guilds.cache.forEach(function (key) {
                if (key.name == servername) {
                    serverID = key.id;
                }
            });
            if (serverID != 0 && serverConfig[serverID] != undefined) {
                if (serverConfig[serverID].modMail.enable) {
                    var modList = serverConfig[serverID].modMail.modList;
                    for (key in modList) {
                        var mod = yield client.users.fetch(modList[key]);
                        const embMsg = new EmbedBuilder()
                            .setTitle(`Mod Mail from: ${servername}`)
                            .setColor('#0B6E29')
                            .setDescription(content)
                            .setFooter({
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        })
                            .setTimestamp();
                        mod.send({ embeds: [embMsg] });
                    }
                }
                else {
                    return warnDisabled(message, 'modMail', module.name);
                }
            }
            else if (serverConfig[serverID] == undefined) {
                return errorCustom(message, `The \`!setup\` command has not been run on \`${servername}\` yet.`, module.name, client);
            }
            else {
                return warnCustom(message, 'The server you specified does not have this bot, or you failed to specify a server.', module.name);
            }
        });
    },
};
//#endregion
