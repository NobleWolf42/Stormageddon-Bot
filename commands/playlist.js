const { MessageEmbed } = require("discord.js");
const { readFileSync } = require('fs');
const { play } = require("../helpers/music.js");
const botConfig = require("../data/botconfig.json");
const YouTubeAPI = require("simple-youtube-api");
const youtube = new YouTubeAPI(botConfig.auth.youtubeApiKey);
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'))
const { djCheck } = require("../helpers/userHandling.js");
const { warnCustom, errorCustom, warnDisabled, errorNoDJ, warnWrongChannel } = require("../helpers/embedMessages.js");

module.exports = {
    name: "playlist",
    type: ['Gulid'],
    aliases: ["pl"],
    cooldown: 3,
    class: 'music',
    usage: 'playlist ***YOUTUBE-PLAYLIST***',
    description: "Plays a playlist from youtube.",
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
            const PRUNING = botConfig.music.pruning;
            const { channel } = message.member.voice;

            const serverQueue = message.client.queue.get(message.guild.id);
            if (serverQueue && channel !== message.guild.me.voice.channel)
                return warnCustom(message, `You must be in the same channel as ${message.client.user}`);

            if (!args.length)
                return warnCustom(message, `Usage: ${message.prefix}playlist <YouTube Playlist URL | Playlist Name>`);
            if (!channel) return warnCustom(message, "You need to join a voice channel first!");

            const permissions = channel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT"))
                return message.errorCustom(message, "Cannot connect to voice channel, missing permissions");
            if (!permissions.has("SPEAK"))
                return errorCustom(message, "I cannot speak in this voice channel, make sure I have the proper permissions!");

            const search = args.join(" ");
            const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
            const url = args[0];
            const urlValid = pattern.test(args[0]);

            const queueConstruct = {
                textChannel: message.channel,
                channel,
                connection: null,
                songs: [],
                loop: false,
                volume: 20,
                playing: true
                };

            let song = null;
            let playlist = null;
            let videos = [];

            if (urlValid) {
                try {
                    playlist = await youtube.getPlaylist(url, { part: "snippet" });
                    videos = await playlist.getVideos(botConfig.music.maxPlatlistSize || 10, { part: "snippet" });
                } catch (error) {
                    console.error(error);
                    return warnCustom(message, "Playlist not found :(");
                }
            } else {
                try {
                    const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
                    playlist = results[0];
                    videos = await playlist.getVideos(botConfig.music.maxPlatlistSize || 10, { part: "snippet" });
                } catch (error) {
                    console.error(error);
                    return warnCustom(message, "Playlist not found :(");
                }
            }

            videos.forEach((video) => {
                song = {
                    title: video.title,
                    url: video.url,
                    duration: video.durationSeconds
                };

                if (serverQueue) {
                    serverQueue.songs.push(song);
                    if (!PRUNING)
                        message.channel
                            .send(`✅ **${song.title}** has been added to the queue by ${message.author.tag}`)
                            .catch(console.error);
                } else {
                    queueConstruct.songs.push(song);
                }
            });

            let playlistEmbed = new MessageEmbed()
                .setTitle(`${playlist.title}`)
                .setURL(playlist.url)
                .setColor("#0E4CB0")
                .setTimestamp();

            if (!PRUNING) {
                playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => `${index + 1}. ${song.title}`));
                if (playlistEmbed.description.length >= 2048)
                    playlistEmbed.description =
                        playlistEmbed.description.substr(0, 2007) + "\nPlaylist larger than character limit...";
            }

            message.channel.send(`\`${message.author.tag}\` Started a playlist`, playlistEmbed);

            if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

            if (!serverQueue) {
                try {
                    queueConstruct.connection = await channel.join();
                    await queueConstruct.connection.voice.setSelfDeaf(true);
                    play(queueConstruct.songs[0], message);
                } catch (error) {
                    console.error(error);
                    message.client.queue.delete(message.guild.id);
                    await channel.leave();
                    return errorCustom(message, `Could not join the channel: ${error}`);
                }
            }
        }
        else {
            warnWrongChannel(message, serverConfig[message.guild.id].music.textChannel);
        }
    }
};
