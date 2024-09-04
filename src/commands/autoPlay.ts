//#region Imports
import { Message } from 'discord.js';
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the play command with the information about it
const autoPlayCommand: Command = {
    name: 'autoplay',
    type: ['Guild'],
    aliases: ['ap'],
    coolDown: 3,
    class: 'music',
    usage: 'autoplay',
    description: 'Toggles wether or not the bot will automatically pick a new song when the queue is done.',
    async execute(message, args, client, distube, collections, serverConfig) {
        const channel = message.channel;

        //Escapes command if run in dm
        if (channel.isDMBased()) {
            return;
        }

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(message, 'music', this.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message)) {
            return errorNoDJ(message, this.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.name) {
            return warnWrongChannel(message, serverConfig.music.textChannel, this.name);
        }

        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message.guildId);

        //Checks to see if user is in a voice channel
        if (!voiceChannel && !queue) {
            return warnCustom(message, 'You must join a voice channel to use this command!', this.name);
        } else if (queue) {
            //FIX this error in the future, distube and discordjs hate each other apparently
            if (voiceChannel != queue.voiceChannel) {
                return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            }
        }

        var autoPlay = queue.toggleAutoplay();
        embedCustom(message, 'Autoplay Toggled', '#0000FF', `Autoplay is now ${autoPlay ? 'On' : 'Off'}.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
    },
};
//#endregion

//#region Exports
export default autoPlayCommand;
//#endregion
