const { canModifyQueue } = require("../helpers/music.js");
const serverConfig = require("../data/serverconfig.json");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "remove",
    type: ['Gulid'],
    aliases: [""],
    cooldown: 0,
    class: 'music',
    usage: 'remove QUEUE-NUMBER',
    description: "Removes song from the queue.",
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
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is no queue.");
            if (!canModifyQueue(message.member)) return;
    
            if (!args.length) return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Queue Number>`);
            if (isNaN(args[0])) return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Queue Number>`);

            const song = queue.songs.splice(args[0] - 1, 1);
            queue.textChannel.send(`\`${message.author.tag}\` ❌ removed **${song[0].title}** from the queue.`);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};