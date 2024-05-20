//#region Dependencies
const { readFileSync } = require('fs');
const lyricsFinder = require("lyrics-finder");
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//#region Helpers
const { embedCustom, warnCustom, warnDisabled, warnWrongChannel } = require("../helpers/embedMessages.js");
//#endregion

//#region This exports the lyrics command with the information about it
module.exports = {
    name: "lyrics",
    type: ['Guild'],
    aliases: ["ly"],
    coolDown: 0,
    class: 'music',
    usage: 'lyrics',
    description: "Gets the lyrics for the currently playing song.",
    async execute(message, args, client, distube) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is nothing playing.", module.name);

            let lyrics = null;

            try {
                lyrics = await lyricsFinder(queue.songs[0].title, "");
                if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
            } catch (error) {
                lyrics = `No lyrics found for ${queue.songs[0].title}.`;
            }

            if (lyrics >= 2048) {
                lyrics = `${lyrics.substring(0, 2045)}...`;
            }

            return await embedCustom(message, "Lyrics", "#0E4CB0", lyrics).catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
