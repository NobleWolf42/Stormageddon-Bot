const { canModifyQueue } = require("../helpers/music.js");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "resume",
    type: ['Gulid'],
    aliases: ["r"],
    cooldown: 0,
    class: 'music',
    usage: 'resume',
    description: "Resumes the currently paused music.",
    execute(message) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music');
            return;
        }

        if (!djCheck(message)) {
            errorNoDJ(message);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is nothing playing.");
            if (!canModifyQueue(message.member, message)) return;

            if (!queue.playing) {
                queue.playing = true;
                queue.connection.dispatcher.resume();
                return queue.textChannel.send(`\`${message.author.tag}\` ▶ resumed the music!`).catch(console.error);
            }

            return warnCustom(message, "The queue is not paused.");
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};