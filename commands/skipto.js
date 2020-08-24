const { canModifyQueue } = require("../helpers/music.js");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "skipto",
    type: ['Guild'],
    aliases: ["st"],
    cooldown: 0,
    class: 'music',
    usage: 'skipto ***QUEUE-NUMBER***',
    description: "Skips to the selected queue number.",
    execute(message, args) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (!djCheck(message)) {
            errorNoDJ(message, module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            if (!args.length)
                return warnCustom(message, `Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`, module.name);

            if (isNaN(args[0]))
                return warnCustom(message, `Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`, module.name);

            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is no queue.", module.name);
            if (!canModifyQueue(message.member, message, module.name)) return;

            if (args[0] > queue.songs.length)
                return warnCustom(message, `The queue is only ${queue.songs.length} songs long!`, module.name);

            queue.playing = true;
            if (queue.loop) {
                for (let i = 0; i < args[0] - 2; i++) {
                    queue.songs.push(queue.songs.shift());
                }
            } else {
                queue.songs = queue.songs.slice(args[0] - 2);
            }
            queue.connection.dispatcher.end();
            queue.textChannel.send(`\`${message.author.tag}\` ⏭ skipped ${args[0] - 1} songs`).catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
};