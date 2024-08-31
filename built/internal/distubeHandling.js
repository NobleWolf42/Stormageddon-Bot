var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
import { EmbedBuilder, ComponentType, ActionRowBuilder } from 'discord.js';
import { Client as GeniusLyrics } from 'genius-lyrics';
const Genius = new GeniusLyrics();
//#endregion
//#region Helpers
import { addToLog } from '../helpers/errorLog.js';
import { pause, skip, stop, volumeDown, volumeUp, repeat, loop, noLoop, shuffle, autoplay } from '../helpers/musicButtons.js';
import { embedCustom } from '../helpers/embedSlashMessages.js';
//#endregion
//Discord client
var dClient = null;
//#region Gets discord client and set it to global variable, Why did I do this? it sucks, FIX
function setDiscordClient(client) {
    dClient = client;
}
//#endregion
//#region music handler, controls the persistent functions of the music feature
/**
 * Controls the persistent functions of the music feature.
 * @param client - Discord.js Client Object
 * @param distube - DisTube Object
 */
function musicHandle(client, distube) {
    return __awaiter(this, void 0, void 0, function* () {
        //This global variable is intentionally so, it makes it so when switching songs it removes the buttons from the old now playing message
        var nowPlayingMessage = {};
        //#region This handles the even issues when a new song starts playing
        distube.on('playSong', (queue, song) => __awaiter(this, void 0, void 0, function* () {
            //Removes buttons from old now playing message
            if (nowPlayingMessage[queue.id]) {
                nowPlayingMessage[queue.id].edit({ components: [] });
            }
            var embMsg = new EmbedBuilder()
                .setTitle('Now Playing')
                .setColor('#0000FF')
                .setDescription(`[\`${song.name}\`](${song.url}) requested by - ${song.user}\nDuration: ${song.formattedDuration}\nVolume: ${queue.volume}%\nLoop: ${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'}\nAutoplay: ${queue.autoplay ? 'On' : 'Off'}`)
                .setTimestamp();
            const searches = yield Genius.songs.search(queue.songs[0].name);
            var songPic = searches[0];
            if (songPic != undefined) {
                embMsg.setImage(songPic.image);
            }
            var buttons1 = new ActionRowBuilder().addComponents(pause, skip, stop, volumeDown, volumeUp);
            var buttons2 = new ActionRowBuilder().addComponents(repeat, loop, noLoop, shuffle, autoplay);
            nowPlayingMessage[queue.id] = yield queue.textChannel.send({
                embeds: [embMsg],
                components: [buttons1, buttons2],
            });
            const collector = nowPlayingMessage[queue.id].createMessageComponentCollector({
                componentType: ComponentType.Button,
            });
            //#region Handles the buttons for the now playing message
            collector.on('collect', (interaction) => __awaiter(this, void 0, void 0, function* () {
                switch (interaction.customId) {
                    case 'pause':
                        if (queue.paused) {
                            queue.resume();
                            embedCustom(interaction, 'Music Resumed', '#0000FF', `Playing [\`${queue.songs[0].name}\`](${queue.songs[0].url}).`, {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        else {
                            queue.pause();
                            embedCustom(interaction, 'Pause', '#0000FF', `Music Paused.`, {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        break;
                    case 'skip':
                        queue.skip().then(() => {
                            embedCustom(interaction, 'Skipped', '#0000FF', `[\`${song.name}\`](${song.url}) successfully skipped.`, {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            }, null, [], null, null);
                            nowPlayingMessage[queue.id].edit({ components: [] });
                        });
                        break;
                    case 'stop':
                        queue.stop().then(() => {
                            queue.voice.leave();
                            embedCustom(interaction, 'Stop', '#0000FF', `Music Stopped.`, {
                                text: `Requested by ${interaction.user.username}`,
                                iconURL: null,
                            }, null, [], null, null);
                            nowPlayingMessage[queue.id].edit({ components: [] });
                        });
                        break;
                    case 'volUp':
                        queue.setVolume(queue.volume + 5);
                        embedCustom(interaction, 'Volume', '#0000FF', `Volume changed to ${queue.volume}%.`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                    case 'volDown':
                        queue.setVolume(queue.volume - 5);
                        embedCustom(interaction, 'Volume', '#0000FF', `Volume changed to ${queue.volume}%.`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                    case 'repeat':
                        queue.setRepeatMode(1);
                        embedCustom(interaction, `Loop On`, '#0E4CB0', 'Music set to loop song.', {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                    case 'loop':
                        queue.setRepeatMode(2);
                        embedCustom(interaction, `Loop On`, '#0E4CB0', 'Music set to loop queue.', {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                    case 'noLoop':
                        queue.setRepeatMode(0);
                        embedCustom(interaction, `Loop Off`, '#0E4CB0', 'Music has returned to normal playback.', {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                    case 'shuffle':
                        queue.shuffle();
                        embedCustom(interaction, 'Shuffled', '#0000FF', `Queue successfully shuffled.`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                    case 'autoplay':
                        var autoPlay = queue.toggleAutoplay();
                        embedCustom(interaction, 'Autoplay Toggled', '#0000FF', `Autoplay is now ${autoPlay ? 'On' : 'Off'}.`, {
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: null,
                        }, null, [], null, null);
                        break;
                }
            }));
            //#endregion
        }));
        //#endregion
        //#region Handles when a song is added to the queue
        distube.on('addSong', (queue, song) => __awaiter(this, void 0, void 0, function* () {
            var embMsg = new EmbedBuilder()
                .setTitle('Song Added to Queue')
                .setColor('#0000FF')
                .setDescription(`[\`${song.name}\`](${song.url}) requested by - ${song.user}\nDuration: ${song.formattedDuration}`)
                .setTimestamp();
            queue.textChannel.send({ embeds: [embMsg] });
        }));
        //#endregion
        //#region Handles whe the vc is empty for some time
        distube.on('empty', (queue) => {
            var embMsg = new EmbedBuilder().setTitle(`Empty Voice Channel`).setColor('#0000FF').setDescription(`${queue.voiceChannel} is empty! Leaving the voice channel.`).setTimestamp();
            queue.textChannel.send({ embeds: [embMsg] });
            queue.voice.leave();
            if (nowPlayingMessage[queue.id]) {
                nowPlayingMessage[queue.id].edit({ components: [] });
                delete nowPlayingMessage[queue.id];
            }
        });
        //#endregion
        //#region Handles when the queue finishes
        distube.on('finish', (queue) => {
            var embMsg = new EmbedBuilder().setTitle(`Finished Queue`).setColor('#0000FF').setDescription(`Queue is empty! Leaving the voice channel.`).setTimestamp();
            queue.textChannel.send({ embeds: [embMsg] });
            queue.voice.leave();
            if (nowPlayingMessage[queue.id]) {
                nowPlayingMessage[queue.id].edit({ components: [] });
                delete nowPlayingMessage[queue.id];
            }
        });
        //#endregion
        //#region Handles when the bot disconnects from a voice channel
        distube.on('disconnect', (queue) => __awaiter(this, void 0, void 0, function* () {
            var embMsg = new EmbedBuilder().setTitle(`Disconnected`).setColor('#0000FF').setDescription(`Disconnected from voice.`).setTimestamp();
            queue.textChannel.send({ embeds: [embMsg] });
            if (nowPlayingMessage[queue.id]) {
                nowPlayingMessage[queue.id].edit({ components: [] });
                delete nowPlayingMessage[queue.id];
            }
        }));
        //#endregion
        //#region Handles when a playlist is added to the queue
        distube.on('addList', (queue, playlist) => {
            var embMsg = new EmbedBuilder()
                .setTitle(`Playlist Added to Queue`)
                .setColor('#0000FF')
                .setDescription(`[\`${playlist.name}\`](${playlist.url}) requested by - ${playlist.user}\nNumber of Songs: ${playlist.songs.length}`)
                .setTimestamp();
            queue.textChannel.send({ embeds: [embMsg] });
        });
        //#endregion
        //#region Error handling
        distube.on('error', (textChannel, e) => __awaiter(this, void 0, void 0, function* () {
            addToLog('fatal error', 'Distube', 'Distube', textChannel.guild.name, textChannel.name, e.message.slice(0, 2000), dClient);
            var embMsg = new EmbedBuilder()
                .setTitle(`Error Encountered`)
                .setColor('#FF0000')
                .setDescription(`Error: ${e.message.slice(0, 2000)}`)
                .setTimestamp();
            textChannel.send({ embeds: [embMsg] });
        }));
        //#endregion
    });
}
//#endregion
//#region exports
export { musicHandle, setDiscordClient };
//#endregion
