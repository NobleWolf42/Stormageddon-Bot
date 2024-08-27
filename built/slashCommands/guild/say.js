//#region Dependencies
var _a = require('discord.js'), SlashCommandBuilder = _a.SlashCommandBuilder, PermissionFlagsBits = _a.PermissionFlagsBits;
//#endregion
//#region Helpers
var _b = require('../../helpers/embedSlashMessages.js'), errorNoAdmin = _b.errorNoAdmin, errorCustom = _b.errorCustom;
//#endregion
//#region This exports the say command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Sends message as bot.')
        .addStringOption(function (option) {
        return option
            .setName('message')
            .setDescription('Message to send as the bot.')
            .setRequired(true);
    })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: function (client, interaction, distube) {
        var argsString = interaction.options.getString('message');
        if (argsString != '') {
            interaction.reply(argsString);
        }
        else {
            return errorCustom(interaction, 'Cannot send an empty message!', module.name, client);
        }
    },
};
//#endregion
