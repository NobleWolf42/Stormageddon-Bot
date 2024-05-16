//#region Dependencies
const { readFileSync } = require('fs');
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//#region Helpers
const { canModifyQueue } = require("../helpers/music.js");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");
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
    execute(message) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (!djCheck(message)) {
            errorNoDJ(message, module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is nothing playing.", module.name);
            if (!canModifyQueue(message.member, message, module.name)) return;

            if (queue.playing) {
                queue.playing = false;
                queue.connection.dispatcher.pause(true);
                return queue.textChannel.send(`\`${message.author.tag}\` ⏸ paused the music.`).catch(console.error);
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
