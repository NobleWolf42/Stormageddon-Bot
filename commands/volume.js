//#region Dependencies
const { readFileSync } = require('fs');
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
//#endregion

//#region Helpers
const { canModifyQueue } = require("../helpers/music.js");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoMod } = require("../helpers/embedMessages.js");
const { modCheck, adminCheck } = require("../helpers/userHandling");
//#endregion

//#region This exports the volume command with the information about it
module.exports = {
    name: "volume",
    type: ['Guild'],
    aliases: ["v"],
    cooldown: 0,
    class: 'music',
    usage: 'volume ***NUMBER(1-100)***',
    description: "Displays volume of currently playing music if no numbers are entered. Can change volume percent if numbers are entered.",
    execute(message, args) {

        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            const queue = message.client.queue.get(message.guild.id);
  
            if (!queue) return warnCustom(message, "There is nothing playing.", module.name);
            if (!canModifyQueue(message.member, message, module.name))
                return warnCustom(message, "You need to join a voice channel first!", module.name);
  
            if (!args[0]) return message.channel.send(`🔊 The current volume is: **${queue.volume}%**`).catch(console.error);
            if (modCheck(message) || adminCheck(message)) {
            
                if (isNaN(args[0])) return warnCustom(message, "Please use a number to set volume.", module.name);
                if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
                    return warnCustom(message, "Please use a number between 0 - 100.", module.name);
  
                queue.volume = args[0];
                queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
  
                return queue.textChannel.send(`\`${message.author.tag}\` Set volume to: **${args[0]}%**`).catch(console.error);
            }
            else {
                errorNoMod(message, module.name);
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
