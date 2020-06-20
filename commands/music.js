//#region Initial set-up
    //#region Dependancies
    var Discord = require('discord.js');
    var ytdl = require('ytdl-core');
    var YouTube = require('simple-youtube-api');

    var config = require('../data/botconfig.json');
    //#endregion

    //#region Initialize Varibles
    var queue = new Map();
    //#endregion
//#endregion

//#region Initialize Youtube
const youtube = new YouTube(config.auth.GOOGLE_API_KEY);
//#endregion

//#region Music Bot Functionality
    //#region Execute the Play Command Function
    async function execute(msg, url) {
        const voiceChannel = msg.member.voiceChannel;

        if (!voiceChannel) return msg.reply('I\'m sorry but you need to be in a voice channel to play music!');
        
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        
        if (!permissions.has('CONNECT')) {
	        return msg.reply('I cannot connect to your voice channel, make sure I have the proper permissions!');
	    }
        
        if (!permissions.has('SPEAK')) {
		    return msg.reply('I cannot speak in this voice channel, make sure I have the proper permissions!');
	    }

	    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            
            if (videos.length <= 30 || msg.author.id == "201665936049176576") {
		        for (const video of Object.values(videos)) {
			        const video2 = await youtube.getVideoByID(video.id).catch(function(error) {console.log('Error Has Occured Loading Video.')}); // eslint-disable-line no-await-in-loop
                    if (video2 != undefined) {
                        await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
                    }
                }
                return msg.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
            }
            else if (videos.length > 30) {
                return msg.reply(`🆘 Playlist: **${playlist.title}** has too many videos! You may only queue playlists tha have 30 or less videos.`);
            }
        }
        else {
		    try {
                var video = await youtube.getVideo(url);
            }
            catch (error) {
                
                try {
				    var videos = await youtube.searchVideos(url, 10);
				    let index = 0;
				    msg.channel.send(`__**Song selection:**__\n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}\nPlease provide a value to select one of the search results ranging from 1-10.`);
                
                    // eslint-disable-next-line max-depth
				    try {
					    var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
						    maxMatches: 1,
						    time: 10000,
						    errors: ['time']
					    });
                    }
                    catch (err) {
					    console.error(err);
					    return msg.channel.send('No or invalid value entered, cancelling video selection.');
				    }
                
                    const videoIndex = parseInt(response.first().content);
				    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                }
                catch (err) {
				    console.error(err);
				    return msg.channel.send('🆘 I could not obtain any search results.');
			    }
		    }
		    return handleVideo(video, msg, voiceChannel);
	    }
    }
    //#endregion

    //#region handlevideo function
    async function handleVideo(video, msg, voiceChannel, playlist = false) {
	    const serverQueue = queue.get(msg.guild.id);
	    const song = {
		    id: video.id,
		    title: Discord.Util.escapeMarkdown(video.title),
		    url: `https://www.youtube.com/watch?v=${video.id}`
	    };
	    if (!serverQueue) {
		    const queueConstruct = {
			    textChannel: msg.channel,
			    voiceChannel: voiceChannel,
			    connection: null,
			    songs: [],
			    volume: 20,
			    playing: true
		    };
		    queue.set(msg.guild.id, queueConstruct);

		    queueConstruct.songs.push(song);

    		try {
	    		var connection = await voiceChannel.join();
		    	queueConstruct.connection = connection;
			    play(msg.guild, queueConstruct.songs[0]);
		    } catch (error) {
		    	console.error(`I could not join the voice channel: ${error}`);
			    queue.delete(msg.guild.id);
			    return msg.channel.send(`I could not join the voice channel: ${error}`);
		    }
	    } else {
    		serverQueue.songs.push(song);
	    	if (playlist) return undefined;
		    else return msg.channel.send(`✅ **${song.title}** has been added to the queue!`);
	    }
	    return undefined;
    }
    //#endregion

    //#region play function
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);

	    if (!song) {
		    serverQueue.voiceChannel.leave();
		    queue.delete(guild.id);
		    return;
	    }

    	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
	    	.on('end', reason => {
		    	if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			    else console.log(reason);
			    serverQueue.songs.shift();
			    play(guild, serverQueue.songs[0]);
		    })
		    .on('error', error => console.error(error));
	    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

	    serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
    }
    //#endregion

    //#region skip function
    function skip(msg) {
        const serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel) return msg.reply('You are not in a voice channel!');
		    if (!serverQueue) return msg.reply('There is nothing playing that I could skip for you.');
	        serverQueue.connection.dispatcher.end('Skip command has been used!');
            return undefined;
    }
    //#endregion

    //#region stop function
    function stop(msg) {
        const serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel) return msg.reply('You are not in a voice channel!');
		    if (!serverQueue) return msg.reply('There is nothing playing that I could stop for you.');
		    serverQueue.songs = [];
		    serverQueue.connection.dispatcher.end('Stop command has been used!');
		    return undefined;
    }
    //#endregion

    //#region volume command
    function volume(msg, volumePercent) {
        const serverQueue = queue.get(msg.guild.id);

        if (!msg.member.voiceChannel) return msg.reply('You are not in a voice channel!');
	    	if (!serverQueue) return msg.reply('There is nothing playing.');
		    if (!volumePercent) return msg.channel.send(`The current volume is: **${serverQueue.volume}%**`);
            if ((volumePercent >= 1) && (volumePercent <= 100)) {
                serverQueue.volume = volumePercent;
		        serverQueue.connection.dispatcher.setVolumeLogarithmic(volumePercent / 100);
                return msg.channel.send(`I set the volume to: **${volumePercent}%**`);
            }
            else {
                return msg.reply(`**${volumePercent}** is not a valid volume setting, you must choose a value inbetween 1-100.`);
            }
    }
    //#endregion

    //#region now playing command
    function nowPlaying(msg) {
        const serverQueue = queue.get(msg.guild.id);

        if (!serverQueue) return msg.reply('There is nothing playing.');
        return msg.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
    }
    //#endregion

    //#region show queue command
    function showQueue(msg) {
        const serverQueue = queue.get(msg.guild.id);

        if (!serverQueue) return msg.reply('There is nothing playing.');
            
        queueshow = `__**Song queue:**__\n${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}\n**Now playing:** ${serverQueue.songs[0].title}`;
        showqueuemsgs = queueshow.match(/[\s\S]{1,1900}/g);
        showqueuemsgs.forEach(txtbody => msg.channel.send(txtbody));
        return;
    }
    //#endregion

    //#region pause command
    function pause(msg) {
        const serverQueue = queue.get(msg.guild.id);

        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('⏸ Paused the music for you!');
        }
        return msg.reply('There is nothing playing.');
    }
    //#endregion

    //#region resume command
    function resume(msg) {
        const serverQueue = queue.get(msg.guild.id);

        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('▶ Resumed the music for you!');
        }
        return msg.reply('There is nothing playing.');
    }
    //#endregion
//#endregion

//#region export
module.exports = { execute, skip, stop, volume, nowPlaying, showQueue, pause, resume, volume };
//#endregion