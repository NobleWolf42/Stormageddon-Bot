//#region Dependencies
var SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
//#endregion
//#region Helpers
var _a = require('../../helpers/embedSlashMessages.js'), warnCustom = _a.warnCustom, embedCustomDM = _a.embedCustomDM;
//#endregion
//#region This exports the set command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('jointocreate')
        .setDescription('Allows you to change the settings for your voice channel.')
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('name')
            .setDescription('Change the name of your JTC Voice Channel.')
            .addStringOption(function (option) {
            return option
                .setName('vcname')
                .setDescription('New name for your channel')
                .setRequired(true);
        });
    }),
    execute: function (client, interaction, distube) {
        var voiceChannel = interaction.member.voice.channel;
        if (client.voiceGenerator.get(interaction.member.id) &&
            client.voiceGenerator.get(interaction.member.id) == voiceChannel.id) {
            switch (interaction.options.getSubcommand()) {
                case 'name':
                    var newName = interaction.options.getString('vcname');
                    if (newName.length > 22 || newName.length < 1) {
                        warnCustom(interaction, 'Not a valid name length, Length must be between 1-22 characters long!', module.name, client);
                    }
                    else {
                        voiceChannel.edit({ name: newName });
                        embedCustomDM(interaction, 'Success:', '#355E3B', 'Channel name changed successfully!', null, client);
                    }
                    break;
                default:
                    warnCustom(interaction, 'Not a valid Join to Create command!', module.name, client);
                    break;
            }
        }
        else {
            warnCustom(interaction, 'You do not own a voice channel!', module.name, client);
        }
        return;
    },
};
//#endregion
