//#region Imports
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { capitalize } from '../helpers/stringHelpers.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
import { LoopType } from '../models/musicModel.js';
//#endregion

//#region This exports the loop command with the information about it
const loopCommand: Command = {
    name: 'loop',
    type: ['Guild'],
    aliases: ['l'],
    coolDown: 0,
    class: 'music',
    usage: 'loop ***SONG/QUEUE/OFF***',
    description: 'Toggle music loop for song/queue/off.',
    async execute(message, args, _client, distube, _collections, serverConfig) {
        const channel = message.channel;

        //#region Escape Conditionals
        if (channel.isDMBased()) {
            return;
        }

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(message, 'music', this.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message.member, serverConfig)) {
            return errorNoDJ(message, this.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.id) {
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
        //#endregion

        //#region Main Logic - Handles changing the Loop Type between Queue, Song, and Off
        const loopMode = capitalize(args[0]);

        switch (loopMode) {
            case LoopType.Song: {
                queue.setRepeatMode(1);
                embedCustom(
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
                break;
            }

            case LoopType.Queue: {
                queue.setRepeatMode(2);
                embedCustom(
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
                break;
            }

            case LoopType.Off: {
                queue.setRepeatMode(0);
                embedCustom(
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
                break;
            }

            default: {
                warnCustom(message, `You must use one of the following options: ${LoopType.Off}, ${LoopType.Queue}, and ${LoopType.Song} `, this.name);
                break;
            }
        }
        //#endregion
    },
};
//#endregion

//#region Exports
export default loopCommand;
//#endregion
