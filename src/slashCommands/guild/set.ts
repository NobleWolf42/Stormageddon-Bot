//#region Dependencies
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { errorCustom } from '../../helpers/embedSlashMessages.js';
import { setAutoRole, setJoinRole, setMusic, setGeneral, setModMail, setJoinToCreateVC, setBlame } from '../../internal/settingsFunctions.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
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
    execute(client, interaction) {
        //#region Escape Logic
        if (!interaction.isChatInputCommand()) {
            return;
        }
        //#endregion

        switch (interaction.options.getString('setting')) {
            case 'autorole':
                setAutoRole(interaction);
                break;

            case 'joinrole':
                setJoinRole(interaction);
                break;

            case 'general':
                setGeneral(interaction);
                break;

            case 'music':
                setMusic(interaction);
                break;

            case 'modmail':
                setModMail(interaction);
                break;

            case 'jointocreatevc':
                setJoinToCreateVC(interaction);
                break;

            case 'blame':
                setBlame(interaction);
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
