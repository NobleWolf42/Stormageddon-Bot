const { play } = require("../helpers/music.js");
const botConfig = require("../data/botconfig.json");
const { readFileSync } = require('fs');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(botConfig.auth.youtubeApiKey);
const scdl = require("soundcloud-downloader");
const { errorCustom, warnCustom, warnDisabled, warnWrongChannel, errorNoDJ } = require('../helpers/embedMessages.js');
const { djCheck } = require("../helpers/userHandling.js");

module.exports = {
    name: "play",
    type: ['Guild'],
    aliases: ["p"],
    cooldown: 3,
    class: 'music',
    usage: 'play SEARCH-TEARM/YOUTUBE-LINK/YOUTUBE-PLAYLIST',
    description: "Plays the selected music in the voice channel you are in.",
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
            const { channel } = message.member.voice;

            const serverQueue = message.client.queue.get(message.guild.id);
            if (!channel) return warnCustom(message, "You need to join a voice channel first!", module.name).catch(console.error);
            if (serverQueue && channel !== message.guild.me.voice.channel)
                return warnCustom(message, `You must be in the same channel as ${message.client.user}`, module.name).catch(console.error);

            if (!args.length)
                return warnCustom(message, `Usage: ${message.prefix}play <YouTube URL | Video Name | Soundcloud URL>`, module.name);

            const permissions = channel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT"))
                return errorCustom(message, "Cannot connect to voice channel, missing permissions!", module.name);
            if (!permissions.has("SPEAK"))
                return errorCustom(message, "I cannot speak in this voice channel, make sure I have the proper permissions!", module.name);

            const search = args.join(" ");
            const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
            const playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
            const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
            const url = args[0];
            const urlValid = videoPattern.test(args[0]);

            // Start the playlist if playlist url was provided
            if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
                return message.client.commands.get("playlist").execute(message, args);
            }

            const queueConstruct = {
                textChannel: message.channel,
                channel,
                connection: null,
                songs: [],
                loop: false,
                volume: 20,
                playing: true
            };

            let songInfo = null;
            let song = null;

            if (urlValid) {
                try {
                    songInfo = await ytdl.getInfo(url);
                    song = {
                        title: songInfo.videoDetails.title,
                        url: songInfo.videoDetails.video_url,
                        duration: songInfo.videoDetails.lengthSeconds
                    };
                } catch (error) {
                    console.error(error);
                    return errorCustom(message, error.message, module.name);
                }
            } else if (scRegex.test(url)) {
                try {
                    const trackInfo = await scdl.getInfo(url, botConfig.auth.soundcloudApiKey);
                    song = {
                        title: trackInfo.title,
                        url: trackInfo.permalink_url,
                        duration: trackInfo.duration / 1000
                    };
                } catch (error) {
                    if (error.statusCode === 404)
                        return errorCustom(message, "Could not find that Soundcloud track.", module.name);
                        return errorCustom(message, "There was an error playing that Soundcloud track.", module.name);
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
                } catch (error) {
                    console.error(error);
                        return errorCustom(message, "No video was found with a matching title", module.name);
                }
            }

            if (serverQueue) {
                serverQueue.songs.push(song);
                return serverQueue.textChannel
                    .send(`✅ **${song.title}** has been added to the queue by \`${message.author.tag}\``)
                    .catch(console.error);
            }

            queueConstruct.songs.push(song);
            message.client.queue.set(message.guild.id, queueConstruct);

            try {
                queueConstruct.connection = await channel.join();
                await queueConstruct.connection.voice.setSelfDeaf(true);
                play(queueConstruct.songs[0], message, module.name);
            } catch (error) {
                console.error(error);
                message.client.queue.delete(message.guild.id);
                await channel.leave();
                return errorCustom(message, `Could not join the channel: ${error}`, module.name);
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel, module.name);
        }
    }
};