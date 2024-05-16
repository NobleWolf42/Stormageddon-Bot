//region Dependencies
const { MessageEmbed } = require("discord.js");
const { readFileSync } = require('fs');
const createBar = require("string-progressbar");
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
//#endregion

//region Helpers
const { warnCustom, warnDisabled, warnWrongChannel } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the nowplaying command with the information about it
module.exports = {
    name: "nowplaying",
    type: ['Guild'],
    aliases: ["np"],
    cooldown: 0,
    class: 'music',
    usage: 'nowplaying',
    description: "Shows the currently playing song.",
    execute(message) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is nothing playing.", module.name);
            const song = queue.songs[0];
            const seek = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000;
            const left = song.duration - seek;

            let nowPlaying = new MessageEmbed()
                .setTitle("Now playing")
                .setDescription(`${song.title}\n${song.url}`)
                .setColor("#0E4CB0")
                .setAuthor("Stormageddon")
                .addField("\u200b", new Date(seek * 1000).toISOString().substr(11, 8) + "[" + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substr(11, 8)), false);

            if (song.duration > 0) nowPlaying.setFooter("Time Remaining: " + new Date(left * 1000).toISOString().substr(11, 8));

            return message.channel.send(nowPlaying);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
