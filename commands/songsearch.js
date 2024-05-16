//#region Dependencies
const { readFileSync } = require('fs');
const YouTubeAPI = require("simple-youtube-api");
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
const botConfig = require("../data/botConfig.json");
//#endregion

//#region Helpers
const { warnCustom, warnDisabled, warnWrongChannel, errorNoDJ, embedCustom } = require("../helpers/embedMessages.js");
const { djCheck } = require("../helpers/userHandling.js");
//#endregion

//Initiates youtube api connection
const youtube = new YouTubeAPI(botConfig.auth.youtubeApiKey);

//#region This exports the songsearch command with the information about it
module.exports = {
    name: "songsearch",
    type: ['Guild'],
    aliases: [""],
    coolDown: 0,
    class: 'music',
    usage: 'songsearch ***SEARCH-TERM***',
    description: "Searches and selects videos to play.",
    async execute(message, args) {
        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (!djCheck(message)) {
            errorNoDJ(message, module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            if (!args.length)
                return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Video Name>`, module.name);
            if (message.channel.activeCollector)
                return warnCustom(message, "A message collector is already active in this channel.", module.name);
            if (!message.member.voice.channel)
                return warnCustom(message, "You need to join a voice channel first!", module.name);

            const search = args.join(" ");

            var resultsEmbedField = "";

            try {
                const results = await youtube.searchVideos(search, 10);
                results.map((video, index) => resultsEmbedField.push({ name: `${video.shortURL}`, value: `${index + 1}. ${video.title}` }));

                var resultsMessage = await embedCustom(message, `**Reply with the song number you want to play**`, "#0E4CB0", `Results for: ${search}`, "", "", resultsEmbedField);

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
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
