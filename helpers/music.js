const ytdl = require("erit-ytdl");
const scdl = require("soundcloud-downloader");
const botConfig = require("../data/botconfig.json");
const { warnCustom, errorCustom } = require('../helpers/embedMessages.js')

async function play(song, message) {

    const queue = message.client.queue.get(message.guild.id);

    if (!song) {
        setTimeout(function () {
        if (queue.connection.dispatcher && message.guild.me.voice.channel) return;
            queue.channel.leave();
            queue.textChannel.send("Leaving voice channel...");
        }, 5 * 1000);
        queue.textChannel.send("❌ Music queue ended.").catch(console.error);
        return message.client.queue.delete(message.guild.id);
    }

    let stream = null;
    let streamType = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    try {
        if (song.url.includes("youtube.com")) {
            stream = await ytdl(song.url, { highWaterMark: 1 << 25 });
        } else if (song.url.includes("soundcloud.com")) {
            try {
                stream = await scdl.downloadFormat(song.url, scdl.FORMATS.OPUS, botConfig.auth.soundcloudApiKey ? botConfig.auth.soundcloudApiKey : undefined);
            } catch (error) {
                stream = await scdl.downloadFormat(song.url, scdl.FORMATS.MP3, botConfig.auth.soundcloudApiKey ? botConfig.auth.soundcloudApiKey : undefined);
                streamType = "unknown";
            }
        }
    } catch (error) {
        if (queue) {
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
        }

        console.error(error);
        return errorCustom(message, `Error: ${error.message ? error.message : error}`, 'Music Helper');
    }

    queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

    const dispatcher = queue.connection
        .play(stream, { type: streamType })
        .on("finish", () => {
            if (collector && !collector.ended) collector.stop();

            if (queue.loop) {
                // if loop is on, push the song back at the end of the queue
                // so it can repeat endlessly
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports.play(queue.songs[0], message);
            } else {
                // Recursively play the next song
                queue.songs.shift();
                module.exports.play(queue.songs[0], message);
            }
        })
        .on("error", (err) => {
            console.error(err);
            queue.songs.shift();
            module.exports.play(queue.songs[0], message);
        });
    dispatcher.setVolumeLogarithmic(queue.volume / 100);

    try {
        var playingMessage = await queue.textChannel.send(`🎶 Started playing: **${song.title}** ${song.url}`);
        await playingMessage.react("⏭");
        await playingMessage.react("⏯");
        await playingMessage.react("🔇");
        await playingMessage.react("🔉");
        await playingMessage.react("🔊");
        await playingMessage.react("🔁");
        await playingMessage.react("⏹");
    } catch (error) {
        console.error(error);
    }

    const filter = (reaction, user) => user.id !== message.client.user.id;
    var collector = playingMessage.createReactionCollector(filter, {
        time: song.duration > 0 ? song.duration * 1000 : 600000
    });

    collector.on("collect", (reaction, user) => {
        if (!queue) return;
        const member = message.guild.member(user);

        switch (reaction.emoji.name) {
            case "⏭":
                queue.playing = true;
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member, message, 'Music Helper')) return;
                queue.connection.dispatcher.end();
                queue.textChannel.send(`\`${user.tag}\` ⏩ skipped the song`).catch(console.error);
                collector.stop();
                break;

            case "⏯":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member, message, 'Music Helper')) return;
                if (queue.playing) {
                    queue.playing = !queue.playing;
                    queue.connection.dispatcher.pause(true);
                    queue.textChannel.send(`\`${user.tag}\` ⏸ paused the music.`).catch(console.error);
                } else {
                    queue.playing = !queue.playing;
                    queue.connection.dispatcher.resume();
                    queue.textChannel.send(`\`${user.tag}\` ▶ resumed the music!`).catch(console.error);
                }
                break;

            case "🔇":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member)) return;
                if (queue.volume <= 0) {
                    queue.volume = 20;
                    queue.connection.dispatcher.setVolumeLogarithmic(20 / 100);
                    queue.textChannel.send(`\`${user.tag}\` 🔊 unmuted the music!`).catch(console.error);
                } else {
                    queue.volume = 0;
                    queue.connection.dispatcher.setVolumeLogarithmic(0);
                    queue.textChannel.send(`\`${user.tag}\` 🔇 muted the music!`).catch(console.error);
                }
                break;
          
            case "🔉":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member) || queue.volume == 0) return;
                if (queue.volume - 10 <= 0) queue.volume = 0;
                else queue.volume = queue.volume - 10;
                queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
                queue.textChannel
                    .send(`\`${user.tag}\` 🔉 decreased the volume, the volume is now ${queue.volume}%`)
                    .catch(console.error);
                break;
          
            case "🔊":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member) || queue.volume == 100) return;
                if (queue.volume + 10 >= 100) queue.volume = 100;
                else queue.volume = queue.volume + 10;
                queue.connection.dispatcher.setVolumeLogarithmic(queue.volume / 100);
                queue.textChannel
                    .send(`\`${user.tag}\` 🔊 increased the volume, the volume is now ${queue.volume}%`)
                    .catch(console.error);
                break;

            case "🔁":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member, message, 'Music Helper')) return;
                queue.loop = !queue.loop;
                queue.textChannel.send(`\`${user.tag}\` has turned the loop ${queue.loop ? "**on**" : "**off**"}.`).catch(console.error);
                break;

            case "⏹":
                reaction.users.remove(user).catch(console.error);
                if (!canModifyQueue(member, message, 'Music Helper')) return console.log('Not In Voicechat');
                queue.songs = [];
                queue.textChannel.send(`\`${user.tag}\` ⏹ stopped the music!`).catch(console.error);
                try {
                    queue.connection.dispatcher.end();
                } catch (error) {
                    console.error(error);
                    queue.connection.disconnect();
                }
                collector.stop();
                break;

            default:
                reaction.users.remove(user).catch(console.error);
                break;
        }
    });

    collector.on("end", () => {
        playingMessage.reactions.removeAll().catch(console.error);
        if (botConfig.music.pruning && playingMessage && !playingMessage.deleted) {
            playingMessage.delete({ timeout: 3000 }).catch(console.error);
        }
    });
};

function canModifyQueue(member, message, commandName) {
    const { channel } = member.voice;
    const botChannel = member.guild.me.voice.channel;

    if (channel !== botChannel) {
        warnCustom(message, "You need to join the voice channel first!", commandName).catch(console.error);
        return false;
    }
    return true;
}

module.exports = { play, canModifyQueue }