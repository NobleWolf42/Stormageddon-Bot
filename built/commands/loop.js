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
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
//#endregion
//#region This exports the loop command with the information about it
const loopCommand = {
    name: 'loop',
    type: ['Guild'],
    aliases: ['l'],
    coolDown: 0,
    class: 'music',
    usage: 'loop ***SONG/QUEUE/OFF***',
    description: 'Toggle music loop for song/queue/off.',
    execute(message, args, client, distube, collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.channel;
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
            var voiceChannel = message.member.voice.channel;
            var queue = distube.getQueue(message.guildId);
            var loopMode = args[0];
            var mods = ['song', 'queue', 'off'];
            if (!queue) {
                return warnCustom(message, 'Nothing is playing right now.', this.name);
                //FIX this error in the future, distube and discordjs hate each other apparently
            }
            else if (voiceChannel != queue.voiceChannel) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            }
            else if (!mods.includes(loopMode)) {
                return warnCustom(message, `You must use one of the following options: ${mods.join(', ')}`, this.name);
            }
            else {
                if (loopMode == 'song') {
                    queue.setRepeatMode(1);
                    embedCustom(message, `Loop On`, '#0E4CB0', 'Music set to loop song.', {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
                else if (loopMode == 'queue') {
                    queue.setRepeatMode(2);
                    embedCustom(message, `Loop On`, '#0E4CB0', 'Music set to loop queue.', {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
                else {
                    queue.setRepeatMode(0);
                    embedCustom(message, `Loop Off`, '#0E4CB0', 'Music has returned to normal playback.', {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
            }
        });
    },
};
//#endregion
//#region Exports
export default loopCommand;
//#endregion
