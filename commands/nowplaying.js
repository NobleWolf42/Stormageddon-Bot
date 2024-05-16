//region Dependencies
const { readFileSync } = require('fs');
const createBar = require("string-progressbar");
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//region Helpers
const { embedCustom, warnCustom, warnDisabled, warnWrongChannel } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the nowplaying command with the information about it
module.exports = {
    name: "nowplaying",
    type: ['Guild'],
    aliases: ["np"],
    coolDown: 0,
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
            var footerTXT = "";

            if (song.duration > 0) {
                footerTXT = "Time Remaining: " + new Date(left * 1000).toISOString().substring(11, 8);
            };

            return embedCustom(message, "Now playing", "#0E4CB0", `${song.title}\n${song.url}`, footerTXT, "", [{ name: "\u200b", value: new Date(seek * 1000).toISOString().substring(11, 8) + "[" + createBar((song.duration == 0 ? seek : song.duration), seek, 20)[0] + "]" + (song.duration == 0 ? " ◉ LIVE" : new Date(song.duration * 1000).toISOString().substring(11, 8)), inline: false }]);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
