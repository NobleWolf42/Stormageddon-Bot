//#region Imports
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the skipto command with the information about it
const skipToCommand: Command = {
    name: 'skipto',
    type: ['Guild'],
    aliases: ['st'],
    coolDown: 0,
    class: 'music',
    usage: 'skipto ***QUEUE-NUMBER***',
    description: 'Skips to the selected queue number.',
    async execute(message, args, _client, distube, _collections, serverConfig) {
        const channel = message.channel;

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

        const argsNumber = Number(args[0]);

        if (argsNumber < 2 || argsNumber > queue.songs.length) {
            return warnCustom(message, `Number must be between 2 and ${queue.songs.length}`, this.name);
        }

        if (!args[0]) {
            return warnCustom(message, 'No song information was included in the command.', this.name);
        }

        queue.songs = queue.songs.splice(argsNumber - 2);
        queue.skip().then((s) => {
            embedCustom(
                message,
                'Skipped',
                '#0000FF',
                `Skipped to [\`${s.name}\`](${s.url}).`,
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
    },
};
//#endregion

//#region Exports
export default skipToCommand;
//#endregion
