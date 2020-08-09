const { canModifyQueue } = require("../helpers/music.js");
const serverConfig = require("../data/serverconfig.json");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "loop",
    type: ['Gulid'],
    aliases: ['l'],
    cooldown: 0,
    class: 'music',
    usage: 'loop',
    description: "Toggle music loop.",
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

            // toggle from false to true and reverse
            queue.loop = !queue.loop;
            return queue.textChannel
                .send(`\`${message.author.tag}\` Has turned the loop ${queue.loop ? "**on**" : "**off**"}.`)
                .catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};