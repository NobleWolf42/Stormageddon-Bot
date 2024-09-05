//#region Imports
import { warnCustom, embedCustom, warnDisabled, errorNoDJ, warnWrongChannel } from '../helpers/embedMessages.js';
import { djCheck } from '../helpers/userPermissions.js';
//#endregion
//#region This exports the showqueue command with the information about it
const showQueueCommand = {
    name: 'showqueue',
    type: ['Guild'],
    aliases: ['q'],
    coolDown: 60,
    class: 'music',
    usage: 'showqueue',
    description: 'Shows the music queue.',
    execute(message, _args, _client, distube, _collections, serverConfig) {
        //Max fields for an embed per discord, change this if it ever changes
        const maxFields = 20;
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
            return errorNoDJ(message, this.name);
        }
        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != channel.name) {
            warnWrongChannel(message, serverConfig.music.textChannel, this.name);
            return;
        }
        const queue = distube.getQueue(message.guildId);
        if (!queue) {
            warnCustom(message, 'Nothing is playing right now.', this.name);
            return;
        }
        let description = queue.songs.map((song, index) => `${index + 1} - [\`${song.name}\`](${song.url})\n`);
        const maxTimes = Math.ceil(description.length / maxFields);
        const slicedDesc = [];
        for (let i = 0; i < maxTimes; i++) {
            slicedDesc.push(description.slice(0, maxFields).join(''));
            description = description.slice(maxFields);
        }
        slicedDesc.forEach((messageContent, index) => {
            embedCustom(message, `Stormageddon Music Queue - ${index + 1} of ${slicedDesc.length}`, '#0E4CB0', messageContent, {
                text: `Requested by ${message.author.tag}`,
                iconURL: null,
            }, null, [], null, null);
        });
    },
};
//#endregion
//#region Exports
export default showQueueCommand;
//#endregion
