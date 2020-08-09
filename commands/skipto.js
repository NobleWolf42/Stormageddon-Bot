const { canModifyQueue } = require("../helpers/music.js");
const serverConfig = require("../data/serverconfig.json");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "skipto",
    type: ['Gulid'],
    aliases: ["st"],
    cooldown: 0,
    class: 'music',
    usage: 'skipto QUEUE-NUMBER',
    description: "Skip to the selected queue number.",
    execute(message, args) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music');
            return;
        }

        if (!djCheck(message)) {
            errorNoDJ(message);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            if (!args.length)
                return warnCustom(message, `Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`);

            if (isNaN(args[0]))
                return warnCustom(message, `Usage: ${message.client.prefix}${module.exports.name} <Queue Number>`);

            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is no queue.");
            if (!canModifyQueue(message.member)) return;

            if (args[0] > queue.songs.length)
                return warnCustom(message, `The queue is only ${queue.songs.length} songs long!`);

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
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};