"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.musicHandle = musicHandle;
exports.setDiscordClient = setDiscordClient;
//#region Dependencies
var discord_js_1 = require("discord.js");
var genius_lyrics_1 = require("genius-lyrics");
var Genius = new genius_lyrics_1.Client();
//#endregion
//#region Helpers
var errorLog_1 = require("../helpers/errorLog");
var musicButtons_1 = require("../helpers/musicButtons");
var embedSlashMessages_1 = require("../helpers/embedSlashMessages");
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
function musicHandle(client, distube) {
    return __awaiter(this, void 0, void 0, function () {
        var nowPlayingMessage;
        var _this = this;
        return __generator(this, function (_a) {
            nowPlayingMessage = {};
            //#region This handles the even issues when a new song starts playing
            distube.on('playSong', function (queue, song) { return __awaiter(_this, void 0, void 0, function () {
                var embMsg, searches, songPic, buttons1, buttons2, _a, _b, collector;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            //Removes buttons from old now playing message
                            if (nowPlayingMessage[queue.id]) {
                                nowPlayingMessage[queue.id].edit({ components: [] });
                            }
                            embMsg = new discord_js_1.EmbedBuilder()
                                .setTitle('Now Playing')
                                .setColor('#0000FF')
                                .setDescription("[`".concat(song.name, "`](").concat(song.url, ") requested by - ").concat(song.user, "\nDuration: ").concat(song.formattedDuration, "\nVolume: ").concat(queue.volume, "%\nLoop: ").concat(queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off', "\nAutoplay: ").concat(queue.autoplay ? 'On' : 'Off'))
                                .setTimestamp();
                            return [4 /*yield*/, Genius.songs.search(queue.songs[0].name)];
                        case 1:
                            searches = _c.sent();
                            songPic = searches[0];
                            if (songPic != undefined) {
                                embMsg.setImage(songPic.image);
                            }
                            buttons1 = new discord_js_1.ActionRowBuilder().addComponents(musicButtons_1.pause, musicButtons_1.skip, musicButtons_1.stop, musicButtons_1.volumeDown, musicButtons_1.volumeUp);
                            buttons2 = new discord_js_1.ActionRowBuilder().addComponents(musicButtons_1.repeat, musicButtons_1.loop, musicButtons_1.noLoop, musicButtons_1.shuffle, musicButtons_1.autoplay);
                            _a = nowPlayingMessage;
                            _b = queue.id;
                            return [4 /*yield*/, queue.textChannel.send({
                                    embeds: [embMsg],
                                    components: [buttons1, buttons2],
                                })];
                        case 2:
                            _a[_b] = _c.sent();
                            collector = nowPlayingMessage[queue.id].createMessageComponentCollector({
                                componentType: discord_js_1.ComponentType.Button,
                            });
                            //#region Handles the buttons for the now playing message
                            collector.on('collect', function (interaction) { return __awaiter(_this, void 0, void 0, function () {
                                var autoPlay;
                                return __generator(this, function (_a) {
                                    switch (interaction.customId) {
                                        case 'pause':
                                            if (queue.paused) {
                                                queue.resume();
                                                (0, embedSlashMessages_1.embedCustom)(interaction, 'Music Resumed', '#0000FF', "Playing [`".concat(queue.songs[0].name, "`](").concat(queue.songs[0].url, ")."), {
                                                    text: "Requested by ".concat(interaction.user.username),
                                                    iconURL: null,
                                                }, null, [], null, null);
                                            }
                                            else {
                                                queue.pause();
                                                (0, embedSlashMessages_1.embedCustom)(interaction, 'Pause', '#0000FF', "Music Paused.", {
                                                    text: "Requested by ".concat(interaction.user.username),
                                                    iconURL: null,
                                                }, null, [], null, null);
                                            }
                                            break;
                                        case 'skip':
                                            queue.skip().then(function () {
                                                (0, embedSlashMessages_1.embedCustom)(interaction, 'Skipped', '#0000FF', "[`".concat(song.name, "`](").concat(song.url, ") successfully skipped."), {
                                                    text: "Requested by ".concat(interaction.user.username),
                                                    iconURL: null,
                                                }, null, [], null, null);
                                                nowPlayingMessage[queue.id].edit({ components: [] });
                                            });
                                            break;
                                        case 'stop':
                                            queue.stop().then(function () {
                                                queue.voice.leave();
                                                (0, embedSlashMessages_1.embedCustom)(interaction, 'Stop', '#0000FF', "Music Stopped.", {
                                                    text: "Requested by ".concat(interaction.user.username),
                                                    iconURL: null,
                                                }, null, [], null, null);
                                                nowPlayingMessage[queue.id].edit({ components: [] });
                                            });
                                            break;
                                        case 'volUp':
                                            queue.setVolume(queue.volume + 5);
                                            (0, embedSlashMessages_1.embedCustom)(interaction, 'Volume', '#0000FF', "Volume changed to ".concat(queue.volume, "%."), {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                        case 'volDown':
                                            queue.setVolume(queue.volume - 5);
                                            (0, embedSlashMessages_1.embedCustom)(interaction, 'Volume', '#0000FF', "Volume changed to ".concat(queue.volume, "%."), {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                        case 'repeat':
                                            queue.setRepeatMode(1);
                                            (0, embedSlashMessages_1.embedCustom)(interaction, "Loop On", '#0E4CB0', 'Music set to loop song.', {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                        case 'loop':
                                            queue.setRepeatMode(2);
                                            (0, embedSlashMessages_1.embedCustom)(interaction, "Loop On", '#0E4CB0', 'Music set to loop queue.', {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                        case 'noLoop':
                                            queue.setRepeatMode(0);
                                            (0, embedSlashMessages_1.embedCustom)(interaction, "Loop Off", '#0E4CB0', 'Music has returned to normal playback.', {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                        case 'shuffle':
                                            queue.shuffle();
                                            (0, embedSlashMessages_1.embedCustom)(interaction, 'Shuffled', '#0000FF', "Queue successfully shuffled.", {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                        case 'autoplay':
                                            autoPlay = queue.toggleAutoplay();
                                            (0, embedSlashMessages_1.embedCustom)(interaction, 'Autoplay Toggled', '#0000FF', "Autoplay is now ".concat(autoPlay ? 'On' : 'Off', "."), {
                                                text: "Requested by ".concat(interaction.user.username),
                                                iconURL: null,
                                            }, null, [], null, null);
                                            break;
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                            return [2 /*return*/];
                    }
                });
            }); });
            //#endregion
            //#region Handles when a song is added to the queue
            distube.on('addSong', function (queue, song) { return __awaiter(_this, void 0, void 0, function () {
                var embMsg;
                return __generator(this, function (_a) {
                    embMsg = new discord_js_1.EmbedBuilder()
                        .setTitle('Song Added to Queue')
                        .setColor('#0000FF')
                        .setDescription("[`".concat(song.name, "`](").concat(song.url, ") requested by - ").concat(song.user, "\nDuration: ").concat(song.formattedDuration))
                        .setTimestamp();
                    queue.textChannel.send({ embeds: [embMsg] });
                    return [2 /*return*/];
                });
            }); });
            //#endregion
            //#region Handles whe the vc is empty for some time
            distube.on('empty', function (queue) {
                var embMsg = new discord_js_1.EmbedBuilder().setTitle("Empty Voice Channel").setColor('#0000FF').setDescription("".concat(queue.voiceChannel, " is empty! Leaving the voice channel.")).setTimestamp();
                queue.textChannel.send({ embeds: [embMsg] });
                queue.voice.leave();
                if (nowPlayingMessage[queue.id]) {
                    nowPlayingMessage[queue.id].edit({ components: [] });
                    delete nowPlayingMessage[queue.id];
                }
            });
            //#endregion
            //#region Handles when the queue finishes
            distube.on('finish', function (queue) {
                var embMsg = new discord_js_1.EmbedBuilder().setTitle("Finished Queue").setColor('#0000FF').setDescription("Queue is empty! Leaving the voice channel.").setTimestamp();
                queue.textChannel.send({ embeds: [embMsg] });
                queue.voice.leave();
                if (nowPlayingMessage[queue.id]) {
                    nowPlayingMessage[queue.id].edit({ components: [] });
                    delete nowPlayingMessage[queue.id];
                }
            });
            //#endregion
            //#region Handles when the bot disconnects from a voice channel
            distube.on('disconnect', function (queue) { return __awaiter(_this, void 0, void 0, function () {
                var embMsg;
                return __generator(this, function (_a) {
                    embMsg = new discord_js_1.EmbedBuilder().setTitle("Disconnected").setColor('#0000FF').setDescription("Disconnected from voice.").setTimestamp();
                    queue.textChannel.send({ embeds: [embMsg] });
                    if (nowPlayingMessage[queue.id]) {
                        nowPlayingMessage[queue.id].edit({ components: [] });
                        delete nowPlayingMessage[queue.id];
                    }
                    return [2 /*return*/];
                });
            }); });
            //#endregion
            //#region Handles when a playlist is added to the queue
            distube.on('addList', function (queue, playlist) {
                var embMsg = new discord_js_1.EmbedBuilder()
                    .setTitle("Playlist Added to Queue")
                    .setColor('#0000FF')
                    .setDescription("[`".concat(playlist.name, "`](").concat(playlist.url, ") requested by - ").concat(playlist.user, "\nNumber of Songs: ").concat(playlist.songs.length))
                    .setTimestamp();
                queue.textChannel.send({ embeds: [embMsg] });
            });
            //#endregion
            //#region Error handling
            distube.on('error', function (textChannel, e) { return __awaiter(_this, void 0, void 0, function () {
                var embMsg;
                return __generator(this, function (_a) {
                    (0, errorLog_1.addToLog)('Fatal Error', 'Distube', 'Distube', textChannel.guild.name, textChannel.name, e.message.slice(0, 2000), dClient);
                    embMsg = new discord_js_1.EmbedBuilder()
                        .setTitle("Error Encountered")
                        .setColor('#FF0000')
                        .setDescription("Error: ".concat(e.message.slice(0, 2000)))
                        .setTimestamp();
                    textChannel.send({ embeds: [embMsg] });
                    return [2 /*return*/];
                });
            }); });
            return [2 /*return*/];
        });
    });
}
//#endregion
