var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorNoDJ, warnCustom, warnDisabled, warnWrongChannel } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
//#endregion
//#region This exports the play command with the information about it
const playCommand = {
    name: 'play',
    type: ['Guild'],
    aliases: ['p'],
    coolDown: 3,
    class: 'music',
    usage: 'play ***SEARCH-TERM/YOUTUBE-LINK/YOUTUBE-PLAYLIST/SPOTIFY-LINK/SPOTIFY-PLAYLIST***',
    description: 'Plays the selected music in the voice channel you are in.',
    execute(message, args, _client, distube, _collections, serverConfig, youtube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Checks to see if the music feature is enabled in this server
            if (!serverConfig.music.enable) {
                return warnDisabled(message, 'music', this.name);
            }
            else if (message.channel.isDMBased()) {
                return;
            }
            //Checks to see if the user has DJ access
            if (!djCheck(message.member, serverConfig)) {
                return errorNoDJ(message, this.name);
            }
            //Checks to see if the message was sent in the correct channel
            if (serverConfig.music.textChannel != message.channel.id) {
                return warnWrongChannel(message, serverConfig.music.textChannel, this.name);
            }
            let song = args.join(' ');
            const voiceChannel = message.member.voice.channel;
            const queue = distube.getQueue(message.guild.id);
            //Checks to see if user is in a voice channel
            if (!voiceChannel && !queue) {
                return warnCustom(message, 'You must join a voice channel to use this command!', this.name);
            }
            else if (queue) {
                if (voiceChannel.id != queue.voiceChannel.id) {
                    return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
                }
            }
            //Checks to see if a song input is detected, is there is a song it checks to see if there is a queue, if there is no queue it plays the song, if there is an queue it will add it to the end of the queue
            if (!song) {
                return warnCustom(message, 'No song input detected, please try again.', this.name);
            }
            else {
                const regex = /^(?:https?:\/\/)?(?:(?:www|m)\.)?(?:youtube\.com|youtu\.be|music\.youtube\.com)(?:\/(?:(?:watch\?v=|embed\/|v\/|shorts\/|live\/)?([\w-]{11}))(?:\S+)?|\/playlist\?list=((?:PL|UU|LL|RD|OL)[\w-]{16,41}))(?:\S+)?/;
                if (song.match(regex)) {
                    const info = yield youtube.getBasicInfo(Array.from(song.matchAll(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi), (m) => m[1])[0]);
                    song = info.basic_info.title;
                }
                distube
                    .play(voiceChannel, song, {
                    member: message.member,
                    message: message,
                    textChannel: message.channel,
                })
                    .catch((err) => {
                    warnCustom(message, `Error Queuing Song, Please Try Again.\n\nError:\n${err.message}`, this.name);
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
export default playCommand;
//#endregion
