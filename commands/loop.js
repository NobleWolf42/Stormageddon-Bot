const { canModifyQueue } = require("../helpers/music.js");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "loop",
    type: ['Guild'],
    aliases: ['l'],
    cooldown: 0,
    class: 'music',
    usage: 'loop',
    description: "Toggle music loop on/off.",
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

            // toggle from false to true and reverse
            queue.loop = !queue.loop;
            return queue.textChannel
                .send(`\`${message.author.tag}\` Has turned the loop ${queue.loop ? "**on**" : "**off**"}.`)
                .catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
};