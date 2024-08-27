//#region Dependencies
const { readFileSync } = require('fs');
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//#region Helpers
const {
    warnCustom,
    warnDisabled,
    warnWrongChannel,
    errorNoDJ,
    embedCustom,
} = require('../helpers/embedMessages.js');
const { djCheck } = require('../helpers/userPermissions.js');
//#endregion

//#region This exports the shuffle command with the information about it
module.exports = {
    name: 'shuffle',
    type: ['Guild'],
    coolDown: 10,
    aliases: [''],
    class: 'music',
    usage: 'shuffle',
    description: 'Shuffles the currently queued music.',
    execute(message, args, client, distube) {
        //Checks to see if the music feature is enabled in this server
        if (!serverConfig[message.guild.id].music.enable) {
            return warnDisabled(message, 'music', module.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message)) {
            return errorNoDJ(message, module.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (
            serverConfig[message.guild.id].music.textChannel !=
            message.channel.name
        ) {
            return warnWrongChannel(
                message,
                serverConfig[message.guild.id].music.textChannel,
                module.name
            );
        }

        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message);

        if (!queue) {
            return warnCustom(
                message,
                'Nothing is playing right now.',
                module.name
            );
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(
                message,
                `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`,
                module.name
            );
        } else if (queue.songs.length == 1) {
            return warnCustom(
                message,
                'There is not another song in the queue.',
                module.name
            );
        } else {
            queue.shuffle();
            embedCustom(
                message,
                'Shuffled',
                '#0000FF',
                `Queue successfully shuffled.`,
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
