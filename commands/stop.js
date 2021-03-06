const { canModifyQueue } = require("../helpers/music.js");
const { updateConfigFile } = require("../helpers/currentsettings.js");
var serverConfig = updateConfigFile();
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");


module.exports = {
    name: "stop",
    type: ['Guild'],
    aliases: [""],
    cooldown: 0,
    class: 'music',
    usage: 'stop',
    description: "Stops the playing music.",
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

            queue.songs = [];
            queue.connection.dispatcher.end();
            queue.textChannel.send(`\`${message.author.tag}\` ⏹ stopped the music!`).catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
};