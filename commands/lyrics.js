const { MessageEmbed } = require("discord.js");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const lyricsFinder = require("lyrics-finder");
const { warnCustom, warnDisabled, warnWrongChannel } = require("../helpers/embedMessages.js");

module.exports = {
    name: "lyrics",
    type: ['Guild'],
    aliases: ["ly"],
    cooldown: 0,
    class: 'music',
    usage: 'lyrics',
    description: "Gets the lyrics for the currently playing song.",
    async execute(message) {
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

            let lyricsEmbed = new MessageEmbed()
                .setTitle("Lyrics")
                .setDescription(lyrics)
                .setColor("#0E4CB0")
                .setTimestamp();

            if (lyricsEmbed.description.length >= 2048)
                lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
            return message.channel.send(lyricsEmbed).catch(console.error);
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
};
