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
const SpotifyToYoutube = require('spotify-to-youtube')
const SpotifyWebApi = require('spotify-web-api-node')
//Sets up needed connection to spotify api
const spotifyApi = new SpotifyWebApi({
    clientId: botConfig.auth.spotifyToken,
    clientSecret: botConfig.auth.spotifySecret
});

function getSpotAPIAuth() {
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
            console.log('The access token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
  
            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
        },
        function(err) {
            console.log('Something went wrong when retrieving an access token', err);
        }
    );
}
getSpotAPIAuth();
setTimeout(function () {getSpotAPIAuth()}, 3599990);
const spotToYoutube = SpotifyToYoutube(spotifyApi);

module.exports = {
    name: "play",
    type: ['Guild'],
    aliases: ["p"],
    cooldown: 3,
    class: 'music',
    usage: 'play SEARCH-TEARM/YOUTUBE-LINK/YOUTUBE-PLAYLIST/SPOTIFY-LINK/SPOTIFY-PLAYLIST',
    description: "Plays the selected music in the voice channel you are in.",
    async execute(message, args) {

        const PRUNING = botConfig.music.pruning;

        async function playSong (message, serverQueue, queueConstruct, song, channel) {
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
        };


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
                return warnCustom(message, `Usage: ${message.prefix}play <YouTube URL | Video/Song Name | Soundcloud URL | Spotify URL>`, module.name);

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
                    playSong (message, serverQueue, queueConstruct, song, channel);
                } catch (error) {
                    console.error(error);
                    return errorCustom(message, error.message, module.name);
                }
            } else if (url.substring(0, 25) == 'https://open.spotify.com/') {
                if (url.substring(0, 31) == 'https://open.spotify.com/track/') {
                    try {
                        songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${await spotToYoutube(url.substring(31, 53))}`);
                        song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                            duration: songInfo.videoDetails.lengthSeconds
                        };
                        playSong (message, serverQueue, queueConstruct, song, channel);
                    } catch (error) {
                        console.error(error);
                        return errorCustom(message, error.message, module.name);
                    }
                } else if (url.substring(0, 34) == 'https://open.spotify.com/playlist/') {
                    spotifyApi.getPlaylistTracks(url.substring(34, 56), {
                        fields: 'items'
                      })
                      .then(
                        async function(data) {
                            var playlistArray = [];
                            for (key in data.body.items) {
                                console.log(key)
                                try {
                                    songInfo = await ytdl.getInfo(`https://www.youtube.com/watch?v=${await spotToYoutube(data.body.items[key].track)}`);
                                    song = {
                                        title: songInfo.videoDetails.title,
                                        url: songInfo.videoDetails.video_url,
                                        duration: songInfo.videoDetails.lengthSeconds
                                    };
                                    if (key == 0) {
                                        playSong (message, serverQueue, queueConstruct, song, channel);
                                    }
                                    else {
                                        if (serverQueue) {
                                            serverQueue.songs.push(song);
                                            if (!PRUNING)
                                                message.channel
                                                    .send(`✅ **${song.title}** has been added to the queue by ${message.author.tag}`)
                                                    .catch(console.error);
                                        } else {
                                            queueConstruct.songs.push(song);
                                            if (!PRUNING)
                                                message.channel
                                                    .send(`✅ **${song.title}** has been added to the queue by ${message.author.tag}`)
                                                    .catch(console.error);
                                        }
                                    }
                                } catch (error) {
                                    console.error(error);
                                    return errorCustom(message, error.message, module.name);
                                }
                            }
                        },
                        function(err) {
                          console.log('Something went wrong!', err);
                        }
                      );
                } else {
                    return errorCustom(message, `That link is not supported. ${url}`, module.name);
                }
            } else if (scRegex.test(url)) {
                try {
                    const trackInfo = await scdl.getInfo(url, botConfig.auth.soundcloudApiKey);
                    song = {
                        title: trackInfo.title,
                        url: trackInfo.permalink_url,
                        duration: trackInfo.duration / 1000
                    };
                    playSong (message, serverQueue, queueConstruct, song, channel);
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
};