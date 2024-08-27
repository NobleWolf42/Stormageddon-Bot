//#region Dependencies
var readFileSync = require('fs').readFileSync;
//#endregion
//#region Data File
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion
//#region Helpers
var _a = require('../helpers/embedMessages.js'), warnCustom = _a.warnCustom, warnDisabled = _a.warnDisabled, warnWrongChannel = _a.warnWrongChannel, errorNoDJ = _a.errorNoDJ, embedCustom = _a.embedCustom;
var djCheck = require('../helpers/userPermissions.js').djCheck;
//#endregion
//#region This exports the loop command with the information about it
module.exports = {
    name: 'loop',
    type: ['Guild'],
    aliases: ['l'],
    coolDown: 0,
    class: 'music',
    usage: 'loop ***SONG/QUEUE/OFF***',
    description: 'Toggle music loop for song/queue/off.',
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
        var loopMode = args[0];
        var mods = ['song', 'queue', 'off'];
        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', module.name);
        }
        else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, "You must join the <#".concat(queue.voiceChannel.id, "> voice channel to use this command!"), module.name);
        }
        else if (!mods.includes(loopMode)) {
            return warnCustom(message, "You must use one of the following options: ".concat(mods.join(', ')), module.name);
        }
        else {
            if (loopMode == 'song') {
                queue.setRepeatMode(1);
                return embedCustom(message, "Loop On", '#0E4CB0', 'Music set to loop song.', {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, null, [], null, null);
            }
            else if (loopMode == 'queue') {
                queue.setRepeatMode(2);
                return embedCustom(message, "Loop On", '#0E4CB0', 'Music set to loop queue.', {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, null, [], null, null);
            }
            else {
                queue.setRepeatMode(0);
                return embedCustom(message, "Loop Off", '#0E4CB0', 'Music has returned to normal playback.', {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, null, [], null, null);
            }
        }
    },
};
//#endregion
