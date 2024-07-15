//#region Helpers
const { updateConfigFile } = require("../helpers/currentSettings.js");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userPermissions.js");
//#endregion

//#region This exports the stop command with the information about it
module.exports = {
    name: "stop",
    type: ['Guild'],
    aliases: [""],
    coolDown: 0,
    class: 'music',
    usage: 'stop',
    description: "Stops the playing music.",
    execute(message, args, client, distube) {
        //Gets current config file
        var serverConfig = updateConfigFile();

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

        if (!queue || !queue.voiceChannel) {
            return warnCustom(message, "Nothing is playing right now.", module.name);
        } else if (voiceChannel != queue.voiceChannel) {
            return warnCustom(message, `You must join the <#${queue.voiceChannel.id}> voice channel to use this command!`, module.name);
        } else {
            queue.stop().then(s => {
                queue.voice.leave();
                embedCustom(message, "Stop", "#0000FF", `Music Stopped.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
            });
        }
    }
}
//#endregion
