const { canModifyQueue } = require("../helpers/music.js");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "remove",
    type: ['Guild'],
    aliases: [""],
    cooldown: 0,
    class: 'music',
    usage: 'remove ***QUEUE-NUMBER***',
    description: "Removes selected song from the queue.",
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
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is no queue.", module.name);
            if (!canModifyQueue(message.member, message, module.name)) return;
    
            if (!args.length) return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Queue Number>`, module.name);
            if (isNaN(args[0])) return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Queue Number>`, module.name);

            const song = queue.songs.splice(args[0] - 1, 1);
            queue.textChannel.send(`\`${message.author.tag}\` ❌ removed **${song[0].title}** from the queue.`);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
};