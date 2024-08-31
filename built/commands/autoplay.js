var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Helpers
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion
//#region This exports the play command with the information about it
module.exports = {
    name: 'autoplay',
    type: ['Guild'],
    aliases: ['ap'],
    coolDown: 3,
    class: 'music',
    usage: 'autoplay',
    description: 'Toggles wether or not the bot will automatically pick a new song when the queue is done.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Calls serverConfig from database
            var serverConfig = (yield MongooseServerConfig.findById(message.guild.id).exec()).toObject();
            //Checks to see if the music feature is enabled in this server
            if (!serverConfig.music.enable) {
                return warnDisabled(message, 'music', module.name);
            }
            //Checks to see if the user has DJ access
            if (!djCheck(message)) {
                return errorNoDJ(message, module.name);
            }
            //Checks to see if the message was sent in the correct channel
            if (serverConfig.music.textChannel != message.channel.name) {
                return warnWrongChannel(message, serverConfig.music.textChannel, module.name);
            }
            var voiceChannel = message.member.voice.channel;
            var queue = distube.getQueue(message);
            //Checks to see if user is in a voice channel
            if (!voiceChannel && !queue) {
                return warnCustom(message, 'You must join a voice channel to use this command!', module.name);
            }
            else if (queue) {
                if (voiceChannel != queue.voiceChannel) {
                    return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
                }
            }
            var autoPlay = queue.toggleAutoplay();
            embedCustom(message, 'Autoplay Toggled', '#0000FF', `Autoplay is now ${autoPlay ? 'On' : 'Off'}.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        });
    },
};
//#endregion
