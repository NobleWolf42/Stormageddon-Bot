var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorCustom, errorNoMod, warnCustom, warnDisabled, warnWrongChannel } from '../helpers/embedMessages.js';
import { modCheck } from '../helpers/userPermissions.js';
//#endregion
//#region This create the playnext command with the information about it
const playNextCommand = {
    name: 'playnext',
    type: ['Guild'],
    aliases: ['pn'],
    coolDown: 0,
    class: 'music',
    usage: 'playnext ***QUEUE-NUMBER/SEARCH-TERM/YOUTUBE-LINK/SPOTIFY-LINK/SOUNDCLOUD-LINK***',
    description: 'Plays the selected song next. (NOTE: Bot Moderator Command ONLY)',
    execute(message, args, client, distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const ogMessage = message;
            const channel = message.channel;
            const argsNumber = Number(args[0]);
            if (channel.isDMBased()) {
                return;
            }
            //Checks to see if the music feature is enabled in this server
            if (!serverConfig.music.enable) {
                return warnDisabled(message, 'music', this.name);
            }
            //Checks to see if user is a bot mod
            if (!modCheck(message.member, serverConfig)) {
                return errorNoMod(message, this.name);
            }
            //Checks to see if the message was sent in the correct channel
            if (serverConfig.music.textChannel != channel.id) {
                return warnWrongChannel(message, serverConfig.music.textChannel, this.name);
            }
            const voiceChannel = message.member.voice.channel;
            const queue = distube.getQueue(message.guildId);
            if (!queue) {
                return warnCustom(message, 'Nothing is playing right now.', this.name);
                //FIX this error in the future, distube and discordjs hate each other apparently
            }
            else if (voiceChannel.id != queue.voiceChannel.id) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            }
            else if (argsNumber > 0 && argsNumber <= queue.songs.length) {
                const playNext = queue.songs.splice(argsNumber - 1, 1)[0];
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
            }
            else if (!args[0]) {
                return warnCustom(message, 'No song information was included in the command.', this.name);
            }
            else {
                const song = args.join(' ');
                //FIX this error in the future, distube and discordjs hate each other apparently
                distube.play(voiceChannel, song, {
                    member: message.member,
                    message: ogMessage,
                    textChannel: channel,
                    position: 1,
                });
                if (!message.deleted) {
                    message.delete();
                    message.deleted = true;
                }
            }
        });
    },
};
//#endregion
//#region Exports
export default playNextCommand;
//#endregion
