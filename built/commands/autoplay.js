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
//#region This creates the play command with the information about it
const autoPlayCommand = {
    name: 'autoplay',
    type: ['Guild'],
    aliases: ['ap'],
    coolDown: 3,
    class: 'music',
    usage: 'autoplay',
    description: 'Toggles wether or not the bot will automatically pick a new song when the queue is done.',
    execute(message, _args, _client, distube, _collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = message.channel;
            //#region Escape Logic
            //Checks to see if command was run in a guild
            if (channel.isDMBased()) {
                return;
            }
            //Checks to see if the music feature is enabled in this server
            if (!serverConfig.music.enable) {
                warnDisabled(message, 'music', this.name);
                return;
            }
            //Checks to see if the user has DJ access
            if (!djCheck(message, serverConfig)) {
                errorNoDJ(message, this.name);
                return;
            }
            //Checks to see if the message was sent in the correct channel
            if (serverConfig.music.textChannel != channel.name) {
                warnWrongChannel(message, serverConfig.music.textChannel, this.name);
                return;
            }
            const queue = distube.getQueue(message.guildId);
            //Checks to see if there is anything currently playing in that guid
            if (!queue) {
                warnCustom(message, 'Nothing is playing right now.', this.name);
                return;
            }
            const voiceChannel = message.member.voice.channel;
            //Checks to see if the user is in the same vc as the bot
            if (voiceChannel.id != queue.voiceChannel.id) {
                warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
                return;
            }
            //#endregion
            //#region Main Logic - This toggles the autoplay feature off and on
            const autoPlay = queue.toggleAutoplay();
            embedCustom(message, 'Autoplay Toggled', '#0000FF', `Autoplay is now ${autoPlay ? 'On' : 'Off'}.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            //#endregion
        });
    },
};
//#endregion
//#region Exports
export default autoPlayCommand;
//#endregion
