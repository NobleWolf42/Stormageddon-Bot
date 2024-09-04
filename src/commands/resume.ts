//#region Import
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the resume command with the information about it
const resumeCommand: Command = {
    name: 'resume',
    type: ['Guild'],
    aliases: ['r'],
    coolDown: 0,
    class: 'music',
    usage: 'resume',
    description: 'Resumes the currently paused music.',
    async execute(message, args, client, distube, collections, serverConfig) {
        const channel = message.channel;

        if (channel.isDMBased()) {
            return;
        }

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            warnDisabled(message, 'music', this.name);
            return;
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message, serverConfig)) {
            errorNoDJ(message, this.name);
            return;
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.name) {
            warnWrongChannel(message, serverConfig.music.textChannel, this.name);
            return;
        }

        const voiceChannel = message.member.voice.channel;
        const queue = distube.getQueue(message.guildId);

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', this.name);
            //FIX this error in the future, distube and discordjs hate each other apparently
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
        } else if (!queue.paused) {
            return warnCustom(message, 'Music is not paused.', this.name);
        } else {
            queue.resume();
            embedCustom(
                message,
                'Music Resumed',
                '#0000FF',
                `Playing [\`${queue.songs[0].name}\`](${queue.songs[0].url}).`,
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

//#region Exports
export default resumeCommand;
//#endregion
