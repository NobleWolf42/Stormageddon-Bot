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

//#region This exports the play command with the information about it
module.exports = {
    name: 'autoplay',
    type: ['Guild'],
    aliases: ['ap'],
    coolDown: 3,
    class: 'music',
    usage: 'autoplay',
    description:
        'Toggles wether or not the bot will automatically pick a new song when the queue is done.',
    async execute(message, args, client, distube) {
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

        //Checks to see if user is in a voice channel
        if (!voiceChannel && !queue) {
            return warnCustom(
                message,
                'You must join a voice channel to use this command!',
                module.name
            );
        } else if (queue) {
            if (voiceChannel != queue.voiceChannel) {
                return warnCustom(
                    message,
                    `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`,
                    module.name
                );
            }
        }

        var autoPlay = queue.toggleAutoplay();
        embedCustom(
            message,
            'Autoplay Toggled',
            '#0000FF',
            `Autoplay is now ${autoPlay ? 'On' : 'Off'}.`,
            { text: `Requested by ${message.author.tag}`, iconURL: null },
            null,
            [],
            null,
            null
        );
    },
};
//#endregion
