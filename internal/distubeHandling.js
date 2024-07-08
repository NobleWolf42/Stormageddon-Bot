//#region Dependencies
const { EmbedBuilder, ComponentType, ActionRowBuilder } = require("discord.js");
//#endregion

//#region Helpers
const { addToLog } = require('../helpers/errorLog.js');
const { pause, skip, stop, volumeDown, volumeUp, repeat, loop, noLoop, shuffle, autoplay } = require("../helpers/musicButtons.js")
//#endregion

//Discord client
var dClient = null;

//#region Gets discord client and set it to global variable
function setDiscordClient(client) {
    dClient = client;
}
//#endregion

//#region music handler, controls the persistent functions of the music feature
/**
 * Controls the persistent functions of the music feature.
 * @param {client} client - Discord.js Client Object
 * @param {distube} distube - DisTube Object
 */
async function musicHandle(client, distube) {
    distube.on('playSong', async (queue, song) => {
        var embMsg = new EmbedBuilder()
            .setTitle("Now Playing")
            .setColor("#0000FF")
            .setDescription(`[\`${song.name}\`](${song.url}) requested by - ${song.user}\nDuration: ${song.formattedDuration}\nVolume: ${queue.volume}%\nLoop: ${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\nAutoplay: ${queue.autoplay ? 'On' : 'Off'}`)
            .setTimestamp();

        var buttons1 = new ActionRowBuilder().addComponents(pause, skip, stop, volumeDown, volumeUp);
        var buttons2 = new ActionRowBuilder().addComponents(repeat, loop, noLoop, shuffle, autoplay);
        
        var nowPlayingMessage = await queue.textChannel.send({ embeds: [embMsg], components: [buttons1, buttons2] });

        const collector = nowPlayingMessage.createMessageComponentCollector({
            componentType: ComponentType.Button
        });

        collector.on('collect', async (interaction) => {
            switch (interaction.customId) {
                case "pause":
                    if (queue.paused) {
                        queue.resume();
                        embedCustom(interaction, "Music Resumed", "#0000FF", `Playing [\`${queue.songs[0].name}\`](${queue.songs[0].url}).`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    } else {
                        queue.pause();
                        embedCustom(interaction, "Pause", "#0000FF", `Music Paused.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    }
                break;

                case "skip":
                    queue.skip().then(() => {
                        embedCustom(interaction, "Skipped", "#0000FF", `[\`${song.name}\`](${song.url}) successfully skipped.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "stop":
                    queue.stop().then(() => {
                        queue.voice.leave();
                        embedCustom(interaction, "Stop", "#0000FF", `Music Stopped.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "volUp":
                    queue.setVolume(queue.volume + 5).then(() => {
                        embedCustom(interaction, "Volume", "#0000FF", `Volume changed to ${queue.volume}%.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "volDown":
                    queue.setVolume(queue.volume - 5).then(() => {
                        embedCustom(interaction, "Volume", "#0000FF", `Volume changed to ${queue.volume}%.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "repeat":
                    queue.setRepeatMode(1).then(() => {
                        embedCustom(interaction, `Loop On`, "#0E4CB0", "Music set to loop song.", { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "loop":
                    queue.setRepeatMode(2).then(() => {
                        embedCustom(interaction, `Loop On`, "#0E4CB0", "Music set to loop queue.", { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "noLoop":
                    queue.setRepeatMode(0).then(() => {
                        embedCustom(interaction, `Loop Off`, "#0E4CB0", "Music has returned to normal playback.", { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "shuffle":
                    queue.shuffle().then(() => {
                        embedCustom(interaction, "Shuffled", "#0000FF", `Queue successfully shuffled.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                    });
                break;

                case "autoplay":
                    var autoPlay = queue.toggleAutoplay();
                    embedCustom(interaction, "Autoplay Toggled", "#0000FF", `Autoplay is now ${autoPlay ? "On" : "Off"}.`, { text: `Requested by ${interaction.user.username}`, iconURL: null }, null, [], null, null);
                break;
            }
        });
    });

    distube.on('addSong', async (queue, song) => {
        var embMsg = new EmbedBuilder()
            .setTitle("Song Added to Queue")
            .setColor("#0000FF")
            .setDescription(`[\`${song.name}\`](${song.url}) requested by - ${song.user}\nDuration: ${song.formattedDuration}`)
            .setTimestamp();
        
        queue.textChannel.send({ embeds: [embMsg] });
    });

    distube.on('empty', queue => {
        var embMsg = new EmbedBuilder()
            .setTitle(`Empty Voice Channel`)
            .setColor("#0000FF")
            .setDescription(`${queue.voiceChannel} is empty! Leaving the voice channel.`)
            .setTimestamp();
        
        queue.textChannel.send({ embeds: [embMsg] });
        queue.voice.leave();
    });

    distube.on('finish', queue => {
        var embMsg = new EmbedBuilder()
            .setTitle(`Finished Queue`)
            .setColor("#0000FF")
            .setDescription(`Queue is empty! Leaving the voice channel.`)
            .setTimestamp();
        
        queue.textChannel.send({ embeds: [embMsg] });
        queue.voice.leave();
    });

    distube.on('disconnect', async (queue) => {
        var embMsg = new EmbedBuilder()
            .setTitle(`Disconnected`)
            .setColor("#0000FF")
            .setDescription(`Disconnected from ${queue.voiceChannel}`)
            .setTimestamp();
        
        queue.textChannel.send({ embeds: [embMsg] });
    });

    distube.on('addList', (queue, playlist) => {
        var embMsg = new EmbedBuilder()
            .setTitle(`Playlist Added to Queue`)
            .setColor("#0000FF")
            .setDescription(`[\`${playlist.name}\`](${playlist.url}) requested by - ${playlist.user}\nNumber of Songs: ${playlist.songs.length}`)
            .setTimestamp();
        
        queue.textChannel.send({ embeds: [embMsg] });
    });

    //Error handling
    distube.on('error', async (textChannel, e) => {

        addToLog("Fatal Error", "Distube", "Distube", textChannel.guild.name, textChannel.name, e.message.slice(0, 2000), dClient);
        var embMsg = new EmbedBuilder()
            .setTitle(`Error Encountered`)
            .setColor("#FF0000")
            .setDescription(`Error: ${e.message.slice(0, 2000)}`)
            .setTimestamp();
        
        textChannel.send({ embeds: [embMsg] });
    });
}
//#endregion

//#region exports
module.exports = { musicHandle, setDiscordClient };
//#endregion