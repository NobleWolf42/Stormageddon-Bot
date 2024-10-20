var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Import
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
//#endregion
//#region This exports the resume command with the information about it
const resumeCommand = {
    name: 'resume',
    type: ['Guild'],
    aliases: ['r'],
    coolDown: 0,
    class: 'music',
    usage: 'resume',
    description: 'Resumes the currently paused music.',
    execute(message, _args, _client, distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.channel;
            if (channel.isDMBased()) {
                return;
            }
            //Checks to see if the music feature is enabled in this server
            if (!serverConfig.music.enable) {
                warnDisabled(message, 'music', this.name);
                return;
            }
            //Checks to see if the user has DJ access
            if (!djCheck(message.member, serverConfig)) {
                errorNoDJ(message, this.name);
                return;
            }
            //Checks to see if the message was sent in the correct channel
            if (serverConfig.music.textChannel != channel.id) {
                warnWrongChannel(message, serverConfig.music.textChannel, this.name);
                return;
            }
            const voiceChannel = message.member.voice.channel;
            const queue = distube.getQueue(message.guildId);
            if (!queue) {
                return warnCustom(message, 'Nothing is playing right now.', this.name);
            }
            else if (voiceChannel.id != queue.voiceChannel.id) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            }
            else if (!queue.paused) {
                return warnCustom(message, 'Music is not paused.', this.name);
            }
            else {
                queue.resume();
                embedCustom(message, 'Music Resumed', '#0000FF', `Playing [\`${queue.songs[0].name}\`](${queue.songs[0].url}).`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            }
        });
    },
};
//#endregion
//#region Exports
export default resumeCommand;
//#endregion
