//#region Dependencies
var readFileSync = require('fs').readFileSync;
//#endregion
//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion
//#region Helpers
var _a = require('../helpers/embedMessages.js'), warnCustom = _a.warnCustom, warnDisabled = _a.warnDisabled, warnWrongChannel = _a.warnWrongChannel, errorNoDJ = _a.errorNoDJ, embedCustom = _a.embedCustom;
var djCheck = require('../helpers/userPermissions.js').djCheck;
//#endregion
//#region This exports the remove command with the information about it
module.exports = {
    name: 'remove',
    type: ['Guild'],
    aliases: [''],
    coolDown: 0,
    class: 'music',
    usage: 'remove ***QUEUE-NUMBER***',
    description: 'Removes selected song from the queue.',
    execute: function (message, args, client, distube) {
        //Checks to see if the music feature is enabled in this server
        if (!serverConfig[message.guild.id].music.enable) {
            return warnDisabled(message, 'music', module.name);
        }
        //Checks to see if the user has DJ access
        if (!djCheck(message)) {
            return errorNoDJ(message, module.name);
        }
        //Checks to see if the message was sent in the correct channel
        if (serverConfig[message.guild.id].music.textChannel !=
            message.channel.name) {
            return warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message);
        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', module.name);
        }
        else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, "You must join the <#".concat(queue.voiceChannel.id, "> voice channel to use this command!"), module.name);
        }
        else if (args[0] < 1 || args[0] > queue.songs.length) {
            return warnCustom(message, "Number must be between 1 and ".concat(queue.songs.length), module.name);
        }
        else if (!args[0] || isNaN(args[0])) {
            return warnCustom(message, 'No song information was included in the command.', module.name);
        }
        else if (args[0] == 1) {
            var song = queue.songs[0];
            queue.skip().then(function (s) {
                embedCustom(message, 'Removed', '#0000FF', "Removed [`".concat(son.name, "`](").concat(song.url, ") from the queue."), {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, null, [], null, null);
            });
        }
        else {
            var removeMe = queue.songs.splice(args[0] - 1, 1)[0];
            if (!removeMe) {
                return (errorCustom(message, 'Failed to remove the track from the queue.', module.name),
                    client);
            }
            return embedCustom(message, 'Removed', '#0000FF', "Removed [`".concat(removeMe.name, "`](").concat(removeMe.url, ") from the queue."), { text: "Requested by ".concat(message.author.tag), iconURL: null }, null, [], null, null);
        }
    },
};
//#endregion
