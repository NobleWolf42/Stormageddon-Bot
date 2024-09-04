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
//#region This exports the skip command with the information about it
const skipCommand = {
    name: 'skip',
    type: ['Guild'],
    aliases: ['s'],
    coolDown: 0,
    class: 'music',
    usage: 'skip',
    description: 'Skips the currently playing song.',
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
            const queue = distube.getQueue(message.guildId);
            if (!queue) {
                return warnCustom(message, 'Nothing is playing right now.', this.name);
            }
            const voiceChannel = message.member.voice.channel;
            if (voiceChannel.id != queue.voiceChannel.id) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            }
            if (queue.songs.length == 1) {
                return warnCustom(message, 'There is not another song in the queue.', this.name);
            }
            const song = queue.songs[0];
            queue.skip().then(() => {
                embedCustom(message, 'Skipped', '#0000FF', `[\`${song.name}\`](${song.url}) successfully skipped.`, {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                }, null, [], null, null);
            });
        });
    },
};
//#endregion
//#region Exports
export default skipCommand;
//#endregion
