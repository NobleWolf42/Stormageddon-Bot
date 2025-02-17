//#region Imports
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom, errorCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the remove command with the information about it
const removeCommand: Command = {
    name: 'remove',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'music',
    usage: 'remove ***QUEUE-NUMBER***',
    description: 'Removes selected song from the queue.',
    async execute(message, args, client, distube, _collections, serverConfig) {
        const channel = message.channel;
        const argNumber = Number(args[0]);

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

        const voiceChannel = message.member.voice.channel;
        const queue = distube.getQueue(message.guildId);

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', this.name);
            //FIX this error in the future, distube and discordjs hate each other apparently
        } else if (voiceChannel.id != queue.voiceChannel.id) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
        } else if (argNumber < 1 || argNumber > queue.songs.length) {
            return warnCustom(message, `Number must be between 1 and ${queue.songs.length}`, this.name);
        } else if (argNumber == 1) {
            const song = queue.songs[0];
            queue.skip().then(() => {
                embedCustom(
                    message,
                    'Removed',
                    '#0000FF',
                    `Removed [\`${song.name}\`](${song.url}) from the queue.`,
                    {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            });
        } else if (!args[0]) {
            return warnCustom(message, 'No song information was included in the command.', this.name);
        } else {
            const removeMe = queue.songs.splice(argNumber - 1, 1)[0];

            if (!removeMe) {
                return errorCustom(message, 'Failed to remove the track from the queue.', this.name, client);
            }

            embedCustom(
                message,
                'Removed',
                '#0000FF',
                `Removed [\`${removeMe.name}\`](${removeMe.url}) from the queue.`,
                { text: `Requested by ${message.author.tag}`, iconURL: null },
                null,
                [],
                null,
                null
            );
        }
    },
};
//#endregion

//#region exports
export default removeCommand;
//#endregion
