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
//#region This exports the shuffle command with the information about it
const shuffleCommand = {
    name: 'shuffle',
    type: ['Guild'],
    coolDown: 10,
    aliases: [''],
    class: 'music',
    usage: 'shuffle',
    description: 'Shuffles the currently queued music.',
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
            const queue = distube.getQueue(message.guildId);
            if (!queue) {
                warnCustom(message, 'Nothing is playing right now.', this.name);
                return;
            }
            const voiceChannel = message.member.voice.channel;
            // TODO Check to see if vc ids are unique, or if server id is need as well
            if (voiceChannel.id != queue.voiceChannel.id) {
                warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
                return;
            }
            if (queue.songs.length == 1) {
                warnCustom(message, 'There is not another song in the queue.', this.name);
                return;
            }
            queue.shuffle();
            embedCustom(message, 'Shuffled', '#0000FF', `Queue successfully shuffled.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default shuffleCommand;
//#endregion
