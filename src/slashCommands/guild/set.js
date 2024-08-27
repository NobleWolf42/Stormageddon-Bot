//#region Dependencies
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
//#endregion

//#region Helpers
const { errorCustom } = require('../../helpers/embedSlashMessages.js');
//#endregion

//#region Internals
const {
    setAutoRole,
    setJoinRole,
    setMusic,
    setGeneral,
    setModMail,
    setJoinToCreateVC,
} = require('../../internal/settingsFunctions.js');
//#endregion

//#region This exports the set command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription(
            'Allows you to change the settings you set during setup.'
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption((option) =>
            option
                .setName('setting')
                .setDescription('Pick the setting to edit.')
                .setRequired(true)
                .setChoices(
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
    execute(message, args, client, distube) {
        switch (interaction.options.getString('setting')) {
            case 'autorole':
                setAutoRole(message);
                break;

            case 'joinrole':
                setJoinRole(message);
                break;

            case 'general':
                setGeneral(message);
                break;

            case 'music':
                setMusic(message);
                break;

            case 'modmail':
                setModMail(message);
                break;

            case 'jointocreatevc':
                setJoinToCreateVC(message);
                break;

            case 'blame':
                setBlame(message);
                break;

            default:
                errorCustom(
                    message,
                    'Not a valid settings category!',
                    module.name,
                    client
                );
                break;
        }
    },
};
//#endregion
