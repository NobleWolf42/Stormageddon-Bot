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
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
//#endregion
//#region Helpers
const { updateConfigFile } = require('../../helpers/currentSettings.js');
const { errorNoServerAdmin, errorCustom, warnCustom, embedCustom, } = require('../../helpers/embedSlashMessages.js');
//##endregion
//#region Internals
const { buildConfigFile } = require('../../internal/settingsFunctions.js');
//#endregion
//#region This exports the mod command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Modify the modmail mod list. MUST HAVE SERVER ADMINISTRATOR STATUS.')
        .addSubcommand((subcommand) => subcommand
        .setName('add')
        .setDescription('Adds user to the list.')
        .addUserOption((option) => option
        .setName('moderator')
        .setDescription('The member to add to modlist')
        .setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('remove')
        .setDescription('Removes user from list')
        .addUserOption((option) => option
        .setName('moderator')
        .setDescription('The member to add to modlist')
        .setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Gets current config file
            var serverConfig = updateConfigFile();
            if (interaction.guild.id in serverConfig) {
                if (interaction.options.size == 0) {
                    return warnCustom(interaction, 'No user input detected!', module.name, client);
                }
                var user = interaction.options.getUser('moderator');
                var serverID = interaction.guildId;
                var array = serverConfig[serverID].modMail.modList;
                var userFound = false;
                var modMail = {};
                array.forEach((item) => {
                    if (item == user) {
                        userFound = true;
                    }
                });
                switch (interaction.options.getSubcommand()) {
                    case 'add':
                        if (!userFound) {
                            array.push(user.id);
                        }
                        else {
                            return warnCustom(interaction, `User ${user.tag} is already a Mod!`, module.name, client);
                        }
                        modMail.modList = array;
                        modMail.enable = true;
                        serverConfig[serverID].modMail = modMail;
                        yield buildConfigFile(serverConfig);
                        embedCustom(interaction, 'Mod Added', '#5D3FD3', `Mod has been successfully added!`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        serverConfig = updateConfigFile();
                        break;
                    case 'remove':
                        if (userFound) {
                            array = array.filter(function (value) {
                                return value != user.id;
                            });
                        }
                        else {
                            return warnCustom(interaction, `User ${user.tag} is not a Mod!`, module.name, client);
                        }
                        modMail.modList = array;
                        modMail.enable = true;
                        serverConfig[serverID].modMail = modMail;
                        yield buildConfigFile(serverConfig);
                        embedCustom(interaction, 'Mod Removed', '#5D3FD3', `Mod has been successfully removed!`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        serverConfig = updateConfigFile();
                        break;
                }
            }
            else {
                return errorCustom(interaction, 'Server is not set up with the bot yet!', module.name, client);
            }
        });
    },
};
export {};
//#endregion
