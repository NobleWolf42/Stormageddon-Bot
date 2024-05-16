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

//#region This exports the resume command with the information about it
module.exports = {
    name: "resume",
    type: ['Guild'],
    aliases: ["r"],
    coolDown: 0,
    class: 'music',
    usage: 'resume',
    description: "Resumes the currently paused music.",
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

            if (!queue.playing) {
                queue.playing = true;
                queue.connection.dispatcher.resume();
                return queue.textChannel.send(`\`${message.author.tag}\` ▶ resumed the music!`).catch(console.error);
            }

            return warnCustom(message, "The queue is not paused.", module.name);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
