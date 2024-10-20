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
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorNoAdmin, warnCustom, embedCustom } from '../../helpers/embedSlashMessages.js';
import { adminCheck } from '../../helpers/userSlashPermissions.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion
//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
const isSymbol = /[~!$%^&*()_+\-={}[\]|:";'<>?,.]/;
//#region This exports the changeprefix command with the information about it
const changePrefixSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('changeprefix')
        .setDescription('Changes the prefix the bot uses in your server.')
        .addStringOption((option) => option.setName('symbol').setDescription('Use one of the following symbols: ~!$%^&*()_+-=[];\',.{}|:"<>?').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute(_client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Logic
            if (!interaction.isChatInputCommand()) {
                return;
            }
            if (!interaction.options.getString('symbol')) {
                warnCustom(interaction, 'You must define a bot prefix.', changePrefixSlashCommand.data.name);
                return;
            }
            if (interaction.options.getString('symbol').length == 1 && isSymbol.test(interaction.options.getString('symbol'))) {
                warnCustom(interaction, 'Bot Prefix Must be ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', changePrefixSlashCommand.data.name);
                return;
            }
            const serverConfig = yield MongooseServerConfig.findById(interaction.guildId).exec();
            if (!adminCheck(interaction, serverConfig.toObject())) {
                errorNoAdmin(interaction, changePrefixSlashCommand.data.name);
                return;
            }
            //#endregion
            serverConfig.prefix = interaction.options.getString('symbol');
            serverConfig.markModified('prefix');
            serverConfig.save();
            embedCustom(interaction, 'Current Prefix:', '#008000', `Current Prefix is ${interaction.options.getString('symbol')}`, {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default changePrefixSlashCommand;
//#endregion
