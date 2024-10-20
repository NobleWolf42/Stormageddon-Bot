//#region Import
import { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This exports the shuffle command with the information about it
const shuffleCommand: Command = {
    name: 'shuffle',
    type: ['Guild'],
    coolDown: 10,
    aliases: [''],
    class: 'music',
    usage: 'shuffle',
    description: 'Shuffles the currently queued music.',
    async execute(message, _args, _client, distube, _collections, serverConfig) {
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
        if (!djCheck(message.member, serverConfig)) {
            errorNoDJ(message, this.name);
            return;
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.id) {
            warnWrongChannel(message, serverConfig.music.textChannel, this.name);
            return;
        }

        const queue = distube.getQueue(message.guildId);

        if (!queue) {
            warnCustom(message, 'Nothing is playing right now.', this.name);
            return;
        }

        const voiceChannel = message.member.voice.channel;

        // TODO Check to see if vc ids are unique, or if server id is need as well
        if (voiceChannel.id != queue.voiceChannel.id) {
            warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, this.name);
            return;
        }

        if (queue.songs.length == 1) {
            warnCustom(message, 'There is not another song in the queue.', this.name);
            return;
        }

        queue.shuffle();
        embedCustom(message, 'Shuffled', '#0000FF', `Queue successfully shuffled.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
    },
};
//#endregion

//#region Exports
export default shuffleCommand;
//#endregion
