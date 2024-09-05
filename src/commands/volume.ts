//#region Imports
import { warnCustom, warnDisabled, warnWrongChannel, embedCustom, errorNoDJ } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the volume command with the information about it
const volumeCommand: Command = {
    name: 'volume',
    type: ['Guild'],
    aliases: ['v'],
    coolDown: 0,
    class: 'music',
    usage: 'volume ***NUMBER(1-100)***',
    description: 'Displays volume of currently playing music if no numbers are entered. Can change volume percent if numbers are entered.',
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
        if (!djCheck(message, serverConfig)) {
            return errorNoDJ(message, this.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.name) {
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

        const volume = Number(args[0]);

        if (!volume) {
            embedCustom(message, 'Volume', '#0000FF', `Volume is currently ${queue.volume}%.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        }
        //#endregion

        //#region Main Logic - set the volume for the music player in that server_
        queue.setVolume(volume);
        embedCustom(message, 'Volume', '#0000FF', `Volume changed to ${queue.volume}%.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        //#endregion
    },
};
//#endregion

//#region Exports
export default volumeCommand;
//#endregion
