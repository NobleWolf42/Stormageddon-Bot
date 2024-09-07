//#region Imports
import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { warnCustom, embedCustomDM } from '../../helpers/embedSlashMessages.js';
import { SlashCommand } from '../../models/slashCommandModel.js';
//#endregion

//#region This exports the set command with the information about it
const joinToCreateSlashCommand: SlashCommand = {
    data: new SlashCommandBuilder()
        .setName('jointocreate')
        .setDescription('Allows you to change the settings for your voice channel.')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('name')
                .setDescription('Change the name of your JTC Voice Channel.')
                .addStringOption((option) => option.setName('vcname').setDescription('New name for your channel').setRequired(true))
        ),
    execute(client, interaction, _distube, collections) {
        if (!interaction.isChatInputCommand() || !(interaction.member instanceof GuildMember)) {
            return;
        }

        const voiceChannel = interaction.member.voice.channel;

        if (!collections.voiceGenerator.get(interaction.member.id) && collections.voiceGenerator.get(interaction.member.id) != voiceChannel.id) {
            warnCustom(interaction, 'You do not own a voice channel!', joinToCreateSlashCommand.data.name);
        }

        switch (interaction.options.getSubcommand()) {
            case 'name': {
                const newName = interaction.options.getString('vcname');

                if (newName.length > 22 || newName.length < 1) {
                    warnCustom(interaction, 'Not a valid name length, Length must be between 1-22 characters long!', joinToCreateSlashCommand.data.name);
                } else {
                    voiceChannel.edit({ name: newName });
                    embedCustomDM(interaction, 'Success:', '#355E3B', 'Channel name changed successfully!', null, client);
                }
                break;
            }

            default: {
                warnCustom(interaction, 'Not a valid Join to Create command!', joinToCreateSlashCommand.data.name);
                break;
            }
        }
    },
};
//#endregion

//#region Exports
export default joinToCreateSlashCommand;
//#endregion
