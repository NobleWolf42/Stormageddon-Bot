const { canModifyQueue } = require("../helpers/music.js");
const serverConfig = require("../data/serverconfig.json");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "shuffle",
    type: ['Gulid'],
    cooldown: 10,
    aliases: [''],
    class: 'music',
    usage: 'shuffle',
    description: "Shuffles the current music queue.",
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
            if (!queue) return warnCustom("There is no queue.");
            if (!canModifyQueue(message.member)) return;

            let songs = queue.songs;
            for (let i = songs.length - 1; i > 1; i--) {
                let j = 1 + Math.floor(Math.random() * i);
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }
            queue.songs = songs;
            message.client.queue.set(message.guild.id, queue);
            queue.textChannel.send(`\`${message.author.tag}\` 🔀 shuffled the queue`);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};