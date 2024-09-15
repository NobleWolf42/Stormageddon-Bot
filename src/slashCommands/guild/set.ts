//#region Dependencies
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorCustom } from '../../helpers/embedSlashMessages.js';
import { setAutoRole, setJoinRole, setMusic, setGeneral, setModMail, setJoinToCreateVC, setBlame } from '../../internal/settingsFunctions.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
import { MongooseServerConfig } from '../../models/serverConfigModel.js';
//#endregion

//#region This exports the set command with the information about it
const setSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows you to change the settings you set during setup.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option.setName('setting').setDescription('Pick the setting to edit.').setRequired(true).setChoices(
                { name: 'Auto Role', value: 'autorole' },
                { name: 'Blame', value: 'blame' },
                { name: 'General', value: 'general' },
                { name: 'Join Role', value: 'joinrole' },
                {
                    name: 'Join To Create Voice Channel',
                    value: 'jointocreatevc',
                },
                { name: 'ModMail', value: 'modmail' },
                { name: 'Music', value: 'music' }
            )
        ),
    async execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion

        const serverConfig = (await MongooseServerConfig.findById(interaction.guildId).exec()).toObject();

        switch (interaction.options.getString('setting')) {
            case 'autorole':
                await setAutoRole(interaction, serverConfig, client);
                break;

            case 'joinrole':
                await setJoinRole(interaction, serverConfig);
                break;

            case 'general':
                await setGeneral(interaction, serverConfig);
                break;

            case 'music':
                await setMusic(interaction, serverConfig);
                break;

            case 'modmail':
                await setModMail(interaction, serverConfig);
                break;

            case 'jointocreatevc':
                await setJoinToCreateVC(interaction, serverConfig);
                break;

            case 'blame':
                await setBlame(interaction, serverConfig);
                break;

            default:
                errorCustom(interaction, 'Not a valid settings category!', setSlashCommand.data.name, client);
                break;
        }
    },
};
//#endregion

//#region Exports
export default setSlashCommand;
//#endregion
