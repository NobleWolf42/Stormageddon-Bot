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
import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { warnCustom, embedCustomDM } from '../../helpers/embedSlashMessages.js';
//#endregion
//#region This exports the set command with the information about it
const joinToCreateSlashCommand = {
    data: new SlashCommandBuilder()
        .setName('jointocreate')
        .setDescription('Allows you to change the settings for your voice channel.')
        .addSubcommand((subcommand) => subcommand
        .setName('name')
        .setDescription('Change the name of your JTC Voice Channel.')
        .addStringOption((option) => option.setName('vcname').setDescription('New name for your channel').setRequired(true))),
    execute(client, interaction, _distube, collections) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.isChatInputCommand() || !(interaction.member instanceof GuildMember)) {
                return;
            }
            const voiceChannel = interaction.member.voice.channel;
            if (!collections.voiceGenerator.get(voiceChannel.id) && collections.voiceGenerator.get(voiceChannel.id) != interaction.member.id) {
                warnCustom(interaction, 'You do not own a voice channel!', joinToCreateSlashCommand.data.name);
                return;
            }
            switch (interaction.options.getSubcommand()) {
                case 'name': {
                    const newName = interaction.options.getString('vcname');
                    if (newName.length > 22 || newName.length < 1) {
                        warnCustom(interaction, 'Not a valid name length, Length must be between 1-22 characters long!', joinToCreateSlashCommand.data.name);
                        break;
                    }
                    if (collections.voiceChanges.get(voiceChannel.id) > 1) {
                        warnCustom(interaction, 'You may only change the name twice every ten minutes due to discord API rate limits.', this.name);
                        return;
                    }
                    voiceChannel.edit({ name: newName });
                    let changes = 0;
                    if (!isNaN(collections.voiceChanges.get(voiceChannel.id))) {
                        changes = collections.voiceChanges.get(voiceChannel.id);
                    }
                    collections.voiceChanges.set(voiceChannel.id, changes + 1);
                    setTimeout(() => {
                        collections.voiceChanges.set(voiceChannel.id, collections.voiceChanges.get(voiceChannel.id) - 1);
                    }, 600000);
                    console.log(collections.voiceChanges.get(voiceChannel.id));
                    embedCustomDM(interaction, 'Success:', '#355E3B', 'Channel name changed successfully!', null, client);
                    break;
                }
                default: {
                    warnCustom(interaction, 'Not a valid Join to Create command!', joinToCreateSlashCommand.data.name);
                    break;
                }
            }
        });
    },
};
//#endregion
//#region Exports
export default joinToCreateSlashCommand;
//#endregion
