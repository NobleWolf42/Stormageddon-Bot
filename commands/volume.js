const { canModifyQueue } = require("../helpers/music.js");
const serverConfig = require("../data/serverconfig.json");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoMod } = require("../helpers/embedMessages.js");
const { modCheck, adminCheck } = require("../helpers/userHandling");

module.exports = {
    name: "volume",
    type: ['Gulid'],
    aliases: ["v"],
    cooldown: 0,
    class: 'music',
    usage: 'volume 1-100',
    description: "Displays volume of currently playing music if no numbers anre entered. Can change volume if numbers are entered.",
    execute(message, args) {

        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music');
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            const queue = message.client.queue.get(message.guild.id);
  
            if (!queue) return warnCustom(message, "There is nothing playing.");
            if (!canModifyQueue(message.member, message))
                return warnCustom(message, "You need to join a voice channel first!");
  
            if (!args[0]) return message.channel.send(`🔊 The current volume is: **${queue.volume}%**`).catch(console.error);
            if (modCheck(message) || adminCheck(message)) {
            
                if (isNaN(args[0])) return warnCustom(message, "Please use a number to set volume.");
                if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
                    return warnCustom(message, "Please use a number between 0 - 100.");
  
                queue.volume = args[0];
                queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
  
                return queue.textChannel.send(`\`${message.author.tag}\` Set volume to: **${args[0]}%**`).catch(console.error);
            }
            else {
                errorNoMod(message);
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};