//#region Imports
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the stop command with the information about it
const stopCommand: Command = {
    name: 'stop',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'music',
    usage: 'stop',
    description: 'Stops the playing music.',
    execute(message, _args, _client, distube, _collections, serverConfig) {
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
            return warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, this.name);
        }

        const queue = distube.getQueue(message.guildId);

        if (!queue || !queue.voiceChannel) {
            return warnCustom(message, 'Nothing is playing right now.', this.name);
        }

        const voiceChannel = message.member.voice.channel;

        if (voiceChannel.id != queue.voiceChannel.id) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
        }

        queue.stop().then(() => {
            queue.voice.leave();
            embedCustom(
                message,
                'Stop',
                '#0000FF',
                `Music Stopped.`,
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
export default stopCommand;
//#endregion
