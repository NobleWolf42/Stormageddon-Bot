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
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } = require('../helpers/embedMessages.js');
const { djCheck } = require('../helpers/userPermissions.js');
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion
//#region This exports the remove command with the information about it
module.exports = {
    name: 'remove',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'music',
    usage: 'remove ***QUEUE-NUMBER***',
    description: 'Removes selected song from the queue.',
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
            var voiceChannel = message.member.voice.channel;
            var queue = distube.getQueue(message);
            if (!queue) {
                return warnCustom(message, 'Nothing is playing right now.', module.name);
            }
            else if (voiceChannel != queue.voiceChannel) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
            }
            else if (args[0] < 1 || args[0] > queue.songs.length) {
                return warnCustom(message, `Number must be between 1 and ${queue.songs.length}`, module.name);
            }
            else if (!args[0] || isNaN(args[0])) {
                return warnCustom(message, 'No song information was included in the command.', module.name);
            }
            else if (args[0] == 1) {
                var song = queue.songs[0];
                queue.skip().then((s) => {
                    embedCustom(message, 'Removed', '#0000FF', `Removed [\`${son.name}\`](${song.url}) from the queue.`, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                });
            }
            else {
                var removeMe = queue.songs.splice(args[0] - 1, 1)[0];
                if (!removeMe) {
                    return errorCustom(message, 'Failed to remove the track from the queue.', module.name), client;
                }
                return embedCustom(message, 'Removed', '#0000FF', `Removed [\`${removeMe.name}\`](${removeMe.url}) from the queue.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            }
        });
    },
};
//#endregion
