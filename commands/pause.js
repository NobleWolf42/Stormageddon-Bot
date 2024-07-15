//#region Dependencies
const { readFileSync } = require('fs');
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//#region Helpers
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userPermissions.js");
//#endregion

//#region This exports the pause command with the information about it
module.exports = {
    name: "pause",
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'music',
    usage: 'pause',
    description: "Pauses the currently playing music.",
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
        if (serverConfig[message.guild.id].music.textChannel != message.channel.name) {
            return warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }

        var voiceChannel = message.member.voice.channel;
        var queue = distube.getQueue(message);

        if (!queue) {
            return warnCustom(message, "Nothing is playing right now.", module.name);
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
        } else if (queue.paused) {
            return warnCustom(message, "Music is already paused.", module.name);
        } else {
            queue.pause();
            embedCustom(message, "Pause", "#0000FF", `Music Paused.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        }
    }
}
//#endregion
