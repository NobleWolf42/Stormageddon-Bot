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
const { warnCustom, warnDisabled, warnWrongChannel, embedCustom } = require('../helpers/embedMessages.js');
const { djCheck } = require('../helpers/userPermissions.js');
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion
//#region This exports the volume command with the information about it
module.exports = {
    name: 'volume',
    type: ['Guild'],
    aliases: ['v'],
    coolDown: 0,
    class: 'music',
    usage: 'volume ***NUMBER(1-100)***',
    description: 'Displays volume of currently playing music if no numbers are entered. Can change volume percent if numbers are entered.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Gets serverConfig from database
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
            var volume = Number(args[0]);
            if (!queue) {
                return warnCustom(message, 'Nothing is playing right now.', module.name);
            }
            else if (voiceChannel != queue.voiceChannel) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
            }
            else if (!volume) {
                embedCustom(message, 'Volume', '#0000FF', `Volume is currently ${queue.volume}%.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            }
            else {
                queue.setVolume(volume);
                embedCustom(message, 'Volume', '#0000FF', `Volume changed to ${queue.volume}%.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            }
        });
    },
};
//#endregion
