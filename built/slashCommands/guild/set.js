//#region Dependencies
var _a = require('discord.js'), SlashCommandBuilder = _a.SlashCommandBuilder, PermissionFlagsBits = _a.PermissionFlagsBits;
//#endregion
//#region Helpers
var errorCustom = require('../../helpers/embedSlashMessages.js').errorCustom;
//#endregion
//#region Internals
var _b = require('../../internal/settingsFunctions.js'), setAutoRole = _b.setAutoRole, setJoinRole = _b.setJoinRole, setMusic = _b.setMusic, setGeneral = _b.setGeneral, setModMail = _b.setModMail, setJoinToCreateVC = _b.setJoinToCreateVC;
//#endregion
//#region This exports the set command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Allows you to change the settings you set during setup.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(function (option) {
        return option
            .setName('setting')
            .setDescription('Pick the setting to edit.')
            .setRequired(true)
            .setChoices({ name: 'Auto Role', value: 'autorole' }, { name: 'Blame', value: 'blame' }, { name: 'General', value: 'general' }, { name: 'Join Role', value: 'joinrole' }, {
            name: 'Join To Create Voice Channel',
            value: 'jointocreatevc',
        }, { name: 'ModMail', value: 'modmail' }, { name: 'Music', value: 'music' });
    }),
    execute: function (message, args, client, distube) {
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
                errorCustom(message, 'Not a valid settings category!', module.name, client);
                break;
        }
    },
};
//#endregion
