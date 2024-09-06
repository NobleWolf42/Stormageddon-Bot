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
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
//#endregion
//#regions Helpers
const { updateConfigFile } = require('../../helpers/currentSettings.js');
const { errorCustom, warnCustom, warnDisabled } = require('../../helpers/embedSlashMessages.js');
//#endregion
//#region This exports the modmail command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('modmail')
        .setDescription('Whisper via Stormageddon to all moderators for the specified server.')
        .addStringOption((option) => option.setName('servername').setDescription('Name of the Server you want to message the mods in.').setRequired(true))
        .addStringOption((option) => option.setName('message').setDescription('Message to send.').setRequired(true)),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Gets current config file
            var serverConfig = updateConfigFile();
            var serverID = 0;
            var servername = interaction.options.getString('servername');
            var content = interaction.options.getString('message');
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
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        })
                            .setTimestamp();
                        mod.send({ embeds: [embMsg] });
                    }
                    return embedCustom(interaction, 'Mod Mail Sent.', '#0B6E29', `**Message:** \`${content}\` \n**Sent To:** \`The Mods at ${servername}\``, {
                        text: `Requested by ${interaction.user.username}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
                else {
                    return warnDisabled(interaction, 'modMail', module.name, client);
                }
            }
            else if (serverConfig[serverID] == undefined) {
                return errorCustom(interaction, `The \`!setup\` command has not been run on \`${servername}\` yet.`, module.name, client);
            }
            else {
                return warnCustom(interaction, 'The server you specified does not have this bot, or you failed to specify a server.', module.name, client);
            }
        });
    },
};
export {};
//#endregion
