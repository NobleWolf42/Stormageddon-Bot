//#region Helpers
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the pause command with the information about it
const pauseCommand: Command = {
    name: 'pause',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'music',
    usage: 'pause',
    description: 'Pauses the currently playing music.',
    async execute(message, _args, _client, distube, _collections, serverConfig) {
        const channel = message.channel;

        if (channel.isDMBased()) {
            return;
        }

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(message, 'music', this.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message, serverConfig)) {
            return errorNoDJ(message, this.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.name) {
            return warnWrongChannel(message, serverConfig.music.textChannel, this.name);
        }

        const voiceChannel = message.member.voice.channel;
        const queue = distube.getQueue(message.guildId);

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', this.name);
        } else if (voiceChannel.id != queue.voiceChannel.id) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
        } else if (queue.paused) {
            return warnCustom(message, 'Music is already paused.', this.name);
        } else {
            queue.pause();
            embedCustom(message, 'Pause', '#0000FF', `Music Paused.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        }
    },
};
//#endregion

//#region Exports
export default pauseCommand;
//#endregion
