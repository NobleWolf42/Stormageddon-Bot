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
import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { embedCustom, errorCustom, warnCustom } from '../../helpers/embedSlashMessages.js';
import { buildConfigFile } from '../../internal/settingsFunctions.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion
//#region This exports the mod command with the information about it
const modSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Modify the modmail mod list. MUST HAVE SERVER ADMINISTRATOR STATUS.')
        .addSubcommand((subcommand) => subcommand
        .setName('add')
        .setDescription('Adds user to the list.')
        .addUserOption((option) => option.setName('moderator').setDescription('The member to add to modlist').setRequired(true)))
        .addSubcommand((subcommand) => subcommand
        .setName('remove')
        .setDescription('Removes user from list')
        .addUserOption((option) => option.setName('moderator').setDescription('The member to add to modlist').setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            const serverConfig = (yield MongooseServerConfig.findById(interaction.guildId).exec()).toObject();
            if (interaction.options.data.length == 0) {
                return warnCustom(interaction, 'No user input detected!', modSlashCommand.data.name);
            }
            if (!serverConfig) {
                return errorCustom(interaction, 'Server is not set up with the bot yet!', modSlashCommand.data.name, client);
            }
            //#endregion
            const serverID = interaction.guild.id;
            const userFound = serverConfig.modMail.modList.find((test) => test == interaction.options.getUser('moderator').id);
            switch (interaction.options.getSubcommand()) {
                case 'add': {
                    if (userFound) {
                        warnCustom(interaction, `User ${interaction.options.getUser('moderator')} is already a Mod!`, modSlashCommand.data.name);
                        return;
                    }
                    const modMail = {
                        enable: true,
                        modList: serverConfig.modMail.modList,
                    };
                    modMail.modList.push(interaction.options.getUser('moderator').id);
                    serverConfig.modMail = modMail;
                    yield buildConfigFile(serverConfig, serverID);
                    embedCustom(interaction, 'Mods Added', '#5D3FD3', `Mod ${interaction.options.getUser('moderator')} has been successfully added!`, {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                    break;
                }
                case 'remove': {
                    if (!userFound) {
                        return warnCustom(interaction, `User ${interaction.options.getUser('moderator')} is not a Mod!`, modSlashCommand.data.name);
                    }
                    const modList = serverConfig.modMail.modList.filter(function (value) {
                        return value != interaction.options.getUser('moderator').id;
                    });
                    const modMail = {
                        enable: true,
                        modList: modList,
                    };
                    serverConfig.modMail = modMail;
                    yield buildConfigFile(serverConfig, serverID);
                    embedCustom(interaction, 'Mods Removed', '#5D3FD3', `Mods have been successfully removed!`, {
                        text: `Requested by ${interaction.user.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                    break;
                }
            }
        });
    },
};
//#endregion
//#region Exports
export default modSlashCommand;
//#endregion
