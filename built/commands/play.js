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
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require('../helpers/embedMessages.js');
const { djCheck } = require('../helpers/userPermissions.js');
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion
//#region This exports the play command with the information about it
module.exports = {
    name: 'play',
    type: ['Guild'],
    aliases: ['p'],
    coolDown: 3,
    class: 'music',
    usage: 'play ***SEARCH-TERM/YOUTUBE-LINK/YOUTUBE-PLAYLIST/SPOTIFY-LINK/SPOTIFY-PLAYLIST***',
    description: 'Plays the selected music in the voice channel you are in.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Calls config from database
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
            var song = args.join(' ');
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
            //Checks to see if a song input is detected, is there is a song it checks to see if there is a queue, if there is no queue it plays the song, if there is an queue it will add it to the end of the queue
            if (!song) {
                return warnCustom(message, 'No song input detected, please try again.', module.name);
            }
            else {
                distube.play(voiceChannel, song, {
                    member: message.member,
                    message: message,
                    textChannel: message.channel,
                });
                message.delete();
                message.deleted = true;
            }
        });
    },
};
//#endregion
