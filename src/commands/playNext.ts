//#region Imports
import { Message } from 'discord.js';
import { errorCustom, errorNoDJ, errorNoMod, warnCustom, warnDisabled, warnWrongChannel } from '../helpers/embedMessages.js';
import { djCheck, modCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This create the playnext command with the information about it
const playNextCommand: Command = {
    name: 'playnext',
    type: ['Guild'],
    aliases: ['pn'],
    coolDown: 0,
    class: 'music',
    usage: 'playnext ***QUEUE-NUMBER/SEARCH-TERM/YOUTUBE-LINK/SPOTIFY-LINK/SOUNDCLOUD-LINK***',
    description: 'Plays the selected song next. (NOTE: Bot Moderator Command ONLY)',
    async execute(message, args, client, distube, collections, serverConfig) {
        const ogMessage: Message = message;
        const channel = message.channel;
        const argsNumber = Number(args[0]);

        if (channel.isDMBased()) {
            return;
        }

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(message, 'music', this.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message, serverConfig)) {
            return errorNoDJ(message, this.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.name) {
            return warnWrongChannel(message, serverConfig.music.textChannel, this.name);
        }

        //Checks to see if user is a bot mod
        if (!modCheck(message, serverConfig)) {
            return errorNoMod(message, this.name);
        }

        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message.guildId);

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', this.name);
            //FIX this error in the future, distube and discordjs hate each other apparently
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
        } else if (argsNumber > 0 && argsNumber <= queue.songs.length) {
            var playNext = queue.songs.splice(argsNumber - 1, 1)[0];

            if (!playNext) {
                return errorCustom(message, 'Failed to find the track in the queue.', this.name, client);
            }

            //FIX this error in the future, distube and discordjs hate each other apparently
            distube.play(voiceChannel, playNext, {
                member: message.member,
                message: ogMessage,
                textChannel: channel,
                position: 1,
            });

            message.delete();
            message.deleted = true;
        } else if (!args[0]) {
            return warnCustom(message, 'No song information was included in the command.', this.name);
        } else {
            var song = args.join(' ');
            //FIX this error in the future, distube and discordjs hate each other apparently
            distube.play(voiceChannel, song, {
                member: message.member,
                message: ogMessage,
                textChannel: channel,
                position: 1,
            });
            message.delete();
            message.deleted = true;
        }
    },
};
//#endregion

//#region Exports
export default playNextCommand;
//#endregion
