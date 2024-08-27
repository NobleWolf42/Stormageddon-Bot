//#region Dependencies
var readFileSync = require('fs').readFileSync;
//#endregion
//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion
//#region Helpers
var _a = require('../helpers/embedMessages.js'), warnCustom = _a.warnCustom, warnDisabled = _a.warnDisabled, warnWrongChannel = _a.warnWrongChannel, embedCustom = _a.embedCustom;
var djCheck = require('../helpers/userPermissions.js').djCheck;
//#endregion
//#region This exports the volume command with the information about it
module.exports = {
    name: 'volume',
    type: ['Guild'],
    aliases: ['v'],
    coolDown: 0,
    class: 'music',
    usage: 'volume ***NUMBER(1-100)***',
    description: 'Displays volume of currently playing music if no numbers are entered. Can change volume percent if numbers are entered.',
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
        var volume = Number(args[0]);
        if (!queue) {
            return warnCustom(message, 'Nothing is playing right now.', module.name);
        }
        else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, "You must join the <#".concat(queue.voiceChannel.id, "> voice channel to use this command!"), module.name);
        }
        else if (!volume) {
            embedCustom(message, 'Volume', '#0000FF', "Volume is currently ".concat(queue.volume, "%."), { text: "Requested by ".concat(message.author.tag), iconURL: null }, null, [], null, null);
        }
        else {
            queue.setVolume(volume);
            embedCustom(message, 'Volume', '#0000FF', "Volume changed to ".concat(queue.volume, "%."), { text: "Requested by ".concat(message.author.tag), iconURL: null }, null, [], null, null);
        }
    },
};
//#endregion
