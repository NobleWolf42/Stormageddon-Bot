//region Dependencies
const ytdl = require("ytdl-core");
const { readFileSync } = require('fs');
//#endregion

//#region Data Files
var serverConfig = JSON.parse(readFileSync('./data/serverConfig.json', 'utf8'));
//#endregion

//#region Helpers
const { canModifyQueue } = require("../helpers/music.js");
const { warnCustom, warnDisabled, warnWrongChannel, errorNoMod, errorCustom } = require("../helpers/embedMessages.js");
const { modCheck } = require("../helpers/userHandling.js");
const { isInteger } = require("../helpers/math.js");
//#endregion

//#region This exports the playnext command with the information about it
module.exports = {
    name: "playnext",
    type: ['Guild'],
    aliases: ["pn"],
    cooldown: 0,
    class: 'music',
    usage: 'playnext ***QUEUE-NUMBER/SEARCH-TEARM/YOUTUBE-LINK/SPOTIFY-LINK*** (NOTE: Bot Moderator Command ONLY)',
    description: "Plays the selected song next.",
    async execute(message, args) {

        async function playSong (message, serverQueue, song) {
            if (serverQueue) {
                serverQueue.songs.splice(1, 0, song);
                return serverQueue.textChannel
                    .send(`✅ **${song.title}** has been added to the front of the queue by \`${message.author.tag}\``)
                    .catch(console.error);
            }
        };

        if (!serverConfig[message.guild.id].music.enable) {
            warnDisabled(message, 'music', module.name);
            return;
        }

        if (!modCheck(message)) {
            errorNoMod(message, module.name);
            return;
        }

        if (serverConfig[message.guild.id].music.textChannel == message.channel.name) {
            if (!args.length)
                return warnCustom(message, `Usage: ${message.prefix}${module.exports.name} <Queue Number>/<Search-Tearm>/<Youtube-Link>/<Spotify-Link>`, module.name);

            const queue = message.client.queue.get(message.guild.id);
            if (!queue) return warnCustom(message, "There is no queue.", module.name);
            if (!canModifyQueue(message.member, message, module.name)) return;

            const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            const url = args[0];
            const urlValid = videoPattern.test(args[0]);
            const serverQueue = message.client.queue.get(message.guild.id);
            let songInfo = null;
            let song = null;

            if (isInteger(args[0])) {
                if (args[0] > queue.songs.length)
                    return warnCustom(message, `The queue is only ${queue.songs.length} songs long!`, module.name);

                queue.playing = true;
                if (queue.loop) {
                    warnCustom(message, `This cannot be used in loop mode, please use ${prefix} to turn off loop mode!`, module.name);
                } else {
                    var first = args[0] - 1;
                    var remove = first + 1;
                    queue.songs.splice(1, 0, queue.songs[first]);
                    queue.songs.splice(remove, 1);
                }
                queue.textChannel.send(`\`${message.author.tag}\` Moved ${queue.songs[1].title} to front of queue`).catch(console.error);
            }
            else if (urlValid) {
                try {
                    songInfo = await ytdl.getInfo(url);
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds
                    };
                    playSong (message, serverQueue, song);
                } catch (error) {
                    console.error(error);
                    return errorCustom(message, error.message, module.name);
                }
            } else if (url.substring(0, 31) == 'https://open.spotify.com/track/') {
                try {
                    songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${await spotToYoutube(url.substring(31, 53))}`);
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds
                    };
                    playSong (message, serverQueue, song);
                } catch (error) {
                    console.error(error);
                    return errorCustom(message, error.message, module.name);
                }
            } else {
                try {
                    const results = await youtube.searchVideos(search, 1);
                    songInfo = await ytdl.getInfo(results[0].url);
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds
                    };
                    playSong (message, serverQueue, queueConstruct, song, channel);
                } catch (error) {
                    console.error(error);
                        return errorCustom(message, "No video was found with a matching title", module.name);
                }
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
}
//#endregion
