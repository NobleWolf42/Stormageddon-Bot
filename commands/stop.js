const { canModifyQueue } = require("../helpers/music.js");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");


module.exports = {
    name: "stop",
    type: ['Gulid'],
    aliases: [""],
    cooldown: 0,
    class: 'music',
    usage: 'stop',
    description: "Stops the playing music.",
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

            queue.songs = [];
            queue.connection.dispatcher.end();
            queue.textChannel.send(`\`${message.author.tag}\` ⏹ stopped the music!`).catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};