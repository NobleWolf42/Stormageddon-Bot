//#region Helpers
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } = require('../helpers/embedMessages.js');
const { djCheck } = require('../helpers/userPermissions.js');
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion

//#region This exports the loop command with the information about it
module.exports = {
    name: 'loop',
    type: ['Guild'],
    aliases: ['l'],
    coolDown: 0,
    class: 'music',
    usage: 'loop ***SONG/QUEUE/OFF***',
    description: 'Toggle music loop for song/queue/off.',
    async execute(message, args, client, distube) {
        //Calls config from database
        var serverConfig = await MongooseServerConfig.findById(message.guild.id).exec()[0];

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
        var loopMode = args[0];
        var mods = ['song', 'queue', 'off'];

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', module.name);
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
        } else if (!mods.includes(loopMode)) {
            return warnCustom(message, `You must use one of the following options: ${mods.join(', ')}`, module.name);
        } else {
            if (loopMode == 'song') {
                queue.setRepeatMode(1);
                return embedCustom(
                    message,
                    `Loop On`,
                    '#0E4CB0',
                    'Music set to loop song.',
                    {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            } else if (loopMode == 'queue') {
                queue.setRepeatMode(2);
                return embedCustom(
                    message,
                    `Loop On`,
                    '#0E4CB0',
                    'Music set to loop queue.',
                    {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            } else {
                queue.setRepeatMode(0);
                return embedCustom(
                    message,
                    `Loop Off`,
                    '#0E4CB0',
                    'Music has returned to normal playback.',
                    {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            }
        }
    },
};
//#endregion
