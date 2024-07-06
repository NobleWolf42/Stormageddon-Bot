//#region Dependencies
const { EmbedBuilder } = require("discord.js");
//#endregion

//#region Helpers
const { addToLog } = require('../helpers/errorLog.js');
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
        
        queue.textChannel.send({ embeds: [embMsg] });
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