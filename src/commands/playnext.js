//#region Helpers
const { warnCustom, warnDisabled, warnWrongChannel, errorNoMod, embedCustom, errorCustom } = require('../helpers/embedMessages.js');
const { modCheck, djCheck } = require('../helpers/userPermissions.js');
//#endregion

//#region This exports the playnext command with the information about it
module.exports = {
    name: 'playnext',
    type: ['Guild'],
    aliases: ['pn'],
    coolDown: 0,
    class: 'music',
    usage: 'playnext ***QUEUE-NUMBER/SEARCH-TERM/YOUTUBE-LINK/SPOTIFY-LINK/SOUNDCLOUD-LINK***',
    description: 'Plays the selected song next. (NOTE: Bot Moderator Command ONLY)',
    async execute(message, args, client, distube) {
        //Calls config from database
        var serverConfig = await MongooseServerConfig.findById(message.guild.id).exec();

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

        //Checks to see if user is a bot mod
        if (!modCheck(message)) {
            return errorNoMod(message, module.name);
        }

        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message);

        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', module.name);
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
        } else if (args[0] > 0 && args[0] <= queue.songs.length) {
            var playNext = queue.songs.splice(args[0] - 1, 1)[0];

            if (!playNext) {
                return errorCustom(message, 'Failed to find the track in the queue.', module.name), client;
            }

            distube.play(voiceChannel, playNext, {
                member: message.member,
                message: message,
                textChannel: message.channel,
                position: 1,
            });

            message.delete();
            message.deleted = true;
        } else if (!args[0] || isNaN(args[0])) {
            return warnCustom(message, 'No song information was included in the command.', module.name);
        } else {
            var song = args.join(' ');
            distube.play(voiceChannel, song, {
                member: message.member,
                message: message,
                textChannel: message.channel,
                position: 1,
            });
            message.delete();
            message.deleted = true;
        }
    },
};
//#endregion
