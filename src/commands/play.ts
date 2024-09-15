//#region Import
//import('discord.js', { with: { 'resolution-mode': 'import' } }).VoiceBasedChannel;
import { VoiceBasedChannel } from 'discord.js';
import { errorNoDJ, warnCustom, warnDisabled, warnWrongChannel } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the play command with the information about it
const playCommand: Command = {
    name: 'play',
    type: ['Guild'],
    aliases: ['p'],
    coolDown: 3,
    class: 'music',
    usage: 'play ***SEARCH-TERM/YOUTUBE-LINK/YOUTUBE-PLAYLIST/SPOTIFY-LINK/SPOTIFY-PLAYLIST***',
    description: 'Plays the selected music in the voice channel you are in.',
    async execute(message, args, _client, distube, _collections, serverConfig) {
        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(message, 'music', this.name);
        } else if (message.channel.isDMBased()) {
            return;
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message, serverConfig)) {
            return errorNoDJ(message, this.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != message.channel.name) {
            return warnWrongChannel(message, serverConfig.music.textChannel, this.name);
        }

        const song = args.join(' ');
        const voiceChannel: VoiceBasedChannel = message.member.voice.channel;
        const queue = distube.getQueue(message.guild.id);

        //Checks to see if user is in a voice channel
        if (!voiceChannel && !queue) {
            return warnCustom(message, 'You must join a voice channel to use this command!', this.name);
        } else if (queue) {
            if (voiceChannel.id != queue.voiceChannel.id) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            }
        }
        //Checks to see if a song input is detected, is there is a song it checks to see if there is a queue, if there is no queue it plays the song, if there is an queue it will add it to the end of the queue
        if (!song) {
            return warnCustom(message, 'No song input detected, please try again.', this.name);
        } else {
            //FIX this error in the future, distube and discordjs hate each other apparently
            distube
                .play(voiceChannel, song, {
                    member: message.member,
                    message: message,
                    textChannel: message.channel,
                })
                .catch((err) => {
                    warnCustom(message, `Error Queuing Song, Please Try Again.\n\nError:\n${err.message}`, this.name);
                });
            message.delete();
            message.deleted = true;
        }
    },
};
//#endregion

//#region Exports
export default playCommand;
//#endregion
