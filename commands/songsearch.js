const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");
const { MessageEmbed } = require("discord.js");
const botConfig = require("../data/botconfig.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(botConfig.auth.youtubeApiKey);

module.exports = {
    name: "songsearch",
    type: ['Gulid'],
    aliases: [""],
    cooldown: 0,
    class: 'music',
    usage: 'songsearch ***SEARCH-TERM***',
    description: "Searches and selects videos to play.",
    async execute(message, args) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music');
            return;
        }

        if (!djCheck(message)) {
            errorNoDJ(message);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            if (!args.length)
                return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Video Name>`);
            if (message.channel.activeCollector)
                return warnCustom(message, "A message collector is already active in this channel.");
            if (!message.member.voice.channel)
                return warnCustom(message, "You need to join a voice channel first!");

            const search = args.join(" ");

            let resultsEmbed = new MessageEmbed()
                .setTitle(`**Reply with the song number you want to play**`)
                .setDescription(`Results for: ${search}`)
                .setColor("#0E4CB0");

            try {
                const results = await youtube.searchVideos(search, 10);
                results.map((video, index) => resultsEmbed.addField(video.shortURL, `${index + 1}. ${video.title}`));

                var resultsMessage = await message.channel.send(resultsEmbed);

                function filter(msg) {
                    const pattern = /(^[1-9][0-9]{0,1}$)/g;
                    return pattern.test(msg.content) && parseInt(msg.content.match(pattern)[0]) <= 10;
                }

                message.channel.activeCollector = true;
                const response = await message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ["time"] });
                const choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;

                message.channel.activeCollector = false;
                message.client.commands.get("play").execute(message, [choice]);
                resultsMessage.delete().catch(console.error);
            } catch (error) {
                console.error(error);
                message.channel.activeCollector = false;
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};