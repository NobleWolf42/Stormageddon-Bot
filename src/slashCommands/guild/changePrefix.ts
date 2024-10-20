//#region Imports
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorNoAdmin, warnCustom, embedCustom } from '../../helpers/embedSlashMessages.js';
import { adminCheck } from '../../helpers/userSlashPermissions.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion

//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
const isSymbol = /[~!$%^&*()_+\-={}[\]|:";'<>?,.]/;

//#region This exports the changeprefix command with the information about it
const changePrefixSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('changeprefix')
        .setDescription('Changes the prefix the bot uses in your server.')
        .addStringOption((option) => option.setName('symbol').setDescription('Use one of the following symbols: ~!$%^&*()_+-=[];\',.{}|:"<>?').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(_client, interaction) {
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

        const serverConfig = await MongooseServerConfig.findById(interaction.guildId).exec();

        if (!adminCheck(interaction, serverConfig.toObject())) {
            errorNoAdmin(interaction, changePrefixSlashCommand.data.name);
            return;
        }
        //#endregion

        serverConfig.prefix = interaction.options.getString('symbol');
        serverConfig.markModified('prefix');
        serverConfig.save();

        embedCustom(
            interaction,
            'Current Prefix:',
            '#008000',
            `Current Prefix is ${interaction.options.getString('symbol')}`,
            {
                text: `Requested by ${interaction.user.tag}`,
                iconURL: null,
            },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion

//#region Exports
export default changePrefixSlashCommand;
//#endregion
