//#region Helpers
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } = require('../helpers/embedMessages.js');
const { djCheck } = require('../helpers/userPermissions.js');
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion

//#region This exports the skipto command with the information about it
module.exports = {
    name: 'skipto',
    type: ['Guild'],
    aliases: ['st'],
    coolDown: 0,
    class: 'music',
    usage: 'skipto ***QUEUE-NUMBER***',
    description: 'Skips to the selected queue number.',
    async execute(message, args, client, distube) {
        //Gets serverConfig from database
        var serverConfig = await MongooseServerConfig.findById(message.guild.id).exec()[0];

        //Checks to see if the music feature is enabled in this server
        if (!serverConfig.music.enable) {
            return warnDisabled(message, 'music', module.name);
        }

        //Checks to see if the user has DJ access
        if (!djCheck(message)) {
            return errorNoDJ(message, module.name);
        }

        //Checks to see if the message was sent in the correct channel
        if (serverConfig.music.textChannel != message.channel.name) {
            return warnWrongChannel(message, serverConfig.music.textChannel, module.name);
        }

        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message);

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', module.name);
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
        } else if (args[0] < 2 || args[0] > queue.songs.length) {
            return warnCustom(message, `Number must be between 2 and ${queue.songs.length}`, module.name);
        } else if (!args[0] || isNaN(args[0])) {
            return warnCustom(message, 'No song information was included in the command.', module.name);
        } else {
            queue.songs = queue.songs.splice(args[0] - 2);
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
        }
    },
};
//#endregion
