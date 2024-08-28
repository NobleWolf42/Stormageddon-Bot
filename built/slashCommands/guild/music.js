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
//#region Dependencies
var _a = require('discord.js'), SlashCommandBuilder = _a.SlashCommandBuilder, EmbedBuilder = _a.EmbedBuilder;
//#endregion
//#region Helpers
var _b = require('../../helpers/embedSlashMessages.js'), warnCustom = _b.warnCustom, warnDisabled = _b.warnDisabled, warnWrongChannel = _b.warnWrongChannel, errorNoDJ = _b.errorNoDJ, embedCustom = _b.embedCustom, errorNoMod = _b.errorNoMod, errorCustom = _b.errorCustom;
var djCheck = require('../../helpers/userPermissions.js').djCheck;
var addToLog = require('../../helpers/errorLog.js').addToLog;
var updateConfigFile = require('../../helpers/currentSettings.js').updateConfigFile;
//#endregion
//#region This exports the music command with the information about it
module.exports = {
    //#region Sets up the command and subcommands and their options
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Commands related to the music function.')
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('play')
            .setDescription('Starts playing a song/playlist or adds it to the queue.')
            .addStringOption(function (option) { return option.setName('song').setDescription('Song Name, or Youtube/Spotify/SoundCloud link.').setRequired(true); });
    })
        .addSubcommand(function (subcommand) { return subcommand.setName('autoplay').setDescription('Toggles autoplay, where the bot will automatically pick a new song when the queue is done.'); })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('loop')
            .setDescription('Set loop type for currently playing music.')
            .addStringOption(function (option) {
            return option
                .setName('looptype')
                .setDescription('Pick type of loop (song/queue/off).')
                .setRequired(true)
                .setChoices({ name: 'Song', value: 'song' }, { name: 'Queue', value: 'queue' }, { name: 'Off', value: 'off' });
        });
    })
        .addSubcommand(function (subcommand) { return subcommand.setName('lyrics').setDescription('Displays lyrics for the current song if they can be found.'); })
        .addSubcommand(function (subcommand) { return subcommand.setName('pause').setDescription('Pauses the currently playing music.'); })
        .addSubcommand(function (subcommand) { return subcommand.setName('resume').setDescription('Resumes paused music.'); })
        .addSubcommand(function (subcommand) { return subcommand.setName('skip').setDescription('Skips to the next song in queue.'); })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('playnext')
            .setDescription('Pick the song to play next from the queue or add a new one up next.')
            .addIntegerOption(function (option) { return option.setName('song').setDescription('Queue Position (number), Song Name, or Youtube/Spotify/SoundCloud link.').setRequired(true); });
    })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('remove')
            .setDescription('Remove a song from the queue.')
            .addStringOption(function (option) { return option.setName('song').setDescription('Queue position of Song.').setRequired(true); });
    })
        .addSubcommand(function (subcommand) { return subcommand.setName('queue').setDescription('Displays the current queue.'); })
        .addSubcommand(function (subcommand) { return subcommand.setName('shuffle').setDescription('Shuffles the current queue.'); })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('skipto')
            .setDescription('Skips to a specific song from the queue.')
            .addIntegerOption(function (option) { return option.setName('song').setDescription('Queue position of Song.').setRequired(true); });
    })
        .addSubcommand(function (subcommand) { return subcommand.setName('stop').setDescription('Stops the current queue.'); })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('volume')
            .setDescription('Display or change the volume.')
            .addIntegerOption(function (option) { return option.setName('volume').setDescription('Volume to change to.').setRequired(false); });
    }),
    //#endregion
    //#region Execution of the commands
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var maxFields, dbCall, serverConfig, channel, voiceChannel, queue, _a, song, autoPlay, loopMode, mods, lyrics, searches, song, error_1, song, playNext, song, song, removeMe, description, maxTimes, i, song, skip, volume;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        maxFields = 20;
                        return [4 /*yield*/, MongooseServerConfig.findById(interaction.guildId).exec()];
                    case 1:
                        dbCall = _b.sent();
                        serverConfig = dbCall[0];
                        //Checks to see if the music feature is enabled in this server
                        if (!serverConfig.music.enable) {
                            return [2 /*return*/, warnDisabled(interaction, 'music', module.name, client)];
                        }
                        //Checks to see if the user has DJ access
                        if (!djCheck(interaction)) {
                            return [2 /*return*/, errorNoDJ(interaction, module.name, client)];
                        }
                        return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                    case 2:
                        channel = _b.sent();
                        if (serverConfig.music.textChannel != channel.name) {
                            return [2 /*return*/, warnWrongChannel(interaction, serverConfig.music.textChannel, module.name, client)];
                        }
                        voiceChannel = interaction.member.voice.channel;
                        queue = distube.getQueue(interaction);
                        //Checks to see if user is in a voice channel
                        if (!voiceChannel) {
                            return [2 /*return*/, warnCustom(interaction, 'You must join a voice channel to use this command!', module.name, client)];
                        }
                        else if (queue && voiceChannel != queue.voiceChannel) {
                            return [2 /*return*/, warnCustom(interaction, "You must join the <#".concat(queue.voiceChannel.id, "> voice channel to use this command!"), module.name, client)];
                        }
                        _a = interaction.options.getSubcommand();
                        switch (_a) {
                            case 'play': return [3 /*break*/, 3];
                            case 'autoplay': return [3 /*break*/, 4];
                            case 'loop': return [3 /*break*/, 5];
                            case 'lyrics': return [3 /*break*/, 6];
                            case 'pause': return [3 /*break*/, 12];
                            case 'resume': return [3 /*break*/, 13];
                            case 'playnext': return [3 /*break*/, 14];
                            case 'remove': return [3 /*break*/, 15];
                            case 'queue': return [3 /*break*/, 16];
                            case 'shuffle': return [3 /*break*/, 17];
                            case 'skip': return [3 /*break*/, 18];
                            case 'skipto': return [3 /*break*/, 19];
                            case 'stop': return [3 /*break*/, 20];
                            case 'volume': return [3 /*break*/, 21];
                        }
                        return [3 /*break*/, 22];
                    case 3:
                        song = interaction.options.getString('song');
                        //Checks to see if a song input is detected, is there is a song it checks to see if there is a queue, if there is no queue it plays the song, if there is an queue it will add it to the end of the queue
                        if (!song) {
                            return [2 /*return*/, warnCustom(interaction, 'No song input detected, please try again.', module.name, client)];
                        }
                        else {
                            distube.play(voiceChannel, song, {
                                member: interaction.member,
                                textChannel: channel,
                            });
                            interaction.reply({
                                content: 'Added',
                                ephemeral: true,
                            });
                        }
                        return [3 /*break*/, 22];
                    case 4:
                        autoPlay = queue.toggleAutoplay();
                        embedCustom(interaction, 'Autoplay Toggled', '#0000FF', "Autoplay is now ".concat(autoPlay ? 'On' : 'Off', "."), {
                            text: "Requested by ".concat(interaction.user.username),
                            iconURL: null,
                        }, null, [], null, null);
                        return [3 /*break*/, 22];
                    case 5:
                        loopMode = interaction.options.getString('looptype');
                        mods = ['song', 'queue', 'off'];
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (!mods.includes(loopMode)) {
                            return [2 /*return*/, warnCustom(interaction, "You must use one of the following options: ".concat(mods.join(', ')), module.name, client)];
                        }
                        else {
                            switch (loopMode) {
                                case 'song':
                                    queue.setRepeatMode(1);
                                    embedCustom(interaction, "Loop On - Song", '#0E4CB0', 'Music set to loop song.', {
                                        text: "Requested by ".concat(interaction.user.username),
                                        iconURL: null,
                                    }, null, [], null, null);
                                    break;
                                case 'queue':
                                    queue.setRepeatMode(2);
                                    embedCustom(interaction, "Loop On - Queue", '#0E4CB0', 'Music set to loop queue.', {
                                        text: "Requested by ".concat(interaction.user.username),
                                        iconURL: null,
                                    }, null, [], null, null);
                                    break;
                                case 'off':
                                    queue.setRepeatMode(0);
                                    embedCustom(interaction, "Loop Off", '#0E4CB0', 'Music has returned to normal playback.', {
                                        text: "Requested by ".concat(interaction.user.username),
                                        iconURL: null,
                                    }, null, [], null, null);
                                    break;
                            }
                        }
                        return [3 /*break*/, 22];
                    case 6:
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'There is nothing playing.', module.name)];
                        }
                        lyrics = null;
                        _b.label = 7;
                    case 7:
                        _b.trys.push([7, 10, , 11]);
                        return [4 /*yield*/, Genius.songs.search(queue.songs[0].name)];
                    case 8:
                        searches = _b.sent();
                        song = searches[0];
                        return [4 /*yield*/, song.lyrics()];
                    case 9:
                        lyrics = _b.sent();
                        if (!lyrics) {
                            lyrics = "No lyrics found for ".concat(queue.songs[0].name, ".");
                        }
                        return [3 /*break*/, 11];
                    case 10:
                        error_1 = _b.sent();
                        addToLog('fatal error', module.name, interaction.user.username, interaction.guild.name, channel.name, error_1, client);
                        lyrics = "No lyrics found for ".concat(queue.songs[0].name, ".");
                        return [3 /*break*/, 11];
                    case 11:
                        slicedLyrics = [];
                        while (lyrics.length >= 2048) {
                            slicedLyrics.push("".concat(lyrics.substring(0, 2045), "..."));
                            lyrics = lyrics.slice(2045);
                        }
                        slicedLyrics.push(lyrics);
                        slicedLyrics.forEach(function (m, index) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                embedCustom(interaction, "".concat(song.fullTitle, " - ").concat(index + 1, " of ").concat(slicedLyrics.length, ":"), '#0E4CB0', m, {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null);
                                return [2 /*return*/];
                            });
                        }); });
                        return [3 /*break*/, 22];
                    case 12:
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (queue.paused) {
                            return [2 /*return*/, warnCustom(interaction, 'Music is already paused.', module.name, client)];
                        }
                        else {
                            queue.pause();
                            embedCustom(interaction, 'Pause', '#0000FF', "Music Paused.", {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 22];
                    case 13:
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (!queue.paused) {
                            return [2 /*return*/, warnCustom(interaction, 'Music is not paused.', module.name, client)];
                        }
                        else {
                            queue.resume();
                            embedCustom(interaction, 'Music Resumed', '#0000FF', "Playing [`".concat(queue.songs[0].name, "`](").concat(queue.songs[0].url, ")."), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 22];
                    case 14:
                        if (!modCheck(interaction)) {
                            return [2 /*return*/, errorNoMod(interaction, module.name, client)];
                        }
                        song = interaction.options.getString('song');
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (song > 0 && song <= queue.songs.length) {
                            playNext = queue.songs.splice(song - 1, 1)[0];
                            if (!playNext) {
                                return [2 /*return*/, errorCustom(interaction, 'Failed to find the track in the queue.', module.name, client)];
                            }
                            distube.play(voiceChannel, song, {
                                member: interaction.member,
                                textChannel: channel,
                                position: 1,
                            });
                        }
                        else if (!song || isNaN(song)) {
                            return [2 /*return*/, warnCustom(interaction, 'No song information was included in the command.', module.name, client)];
                        }
                        else {
                            distube.play(voiceChannel, song, {
                                member: interaction.member,
                                textChannel: channel,
                                position: 1,
                            });
                        }
                        return [3 /*break*/, 22];
                    case 15:
                        song = interaction.options.getInteger('song');
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (song < 1 || song > queue.songs.length) {
                            return [2 /*return*/, warnCustom(interaction, "Number must be between 1 and ".concat(queue.songs.length), module.name, client)];
                        }
                        else if (!song || isNaN(song)) {
                            return [2 /*return*/, warnCustom(interaction, 'No song information was included in the command.', module.name, client)];
                        }
                        else if (song == 1) {
                            song = queue.songs[0];
                            queue.skip().then(function () {
                                embedCustom(interaction, 'Removed', '#0000FF', "Removed [`".concat(son.name, "`](").concat(song.url, ") from the queue."), {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null);
                            });
                        }
                        else {
                            removeMe = queue.songs.splice(song - 1, 1)[0];
                            if (!removeMe) {
                                return [2 /*return*/, (errorCustom(interaction, 'Failed to remove the track from the queue.', module.name, client), client)];
                            }
                            return [2 /*return*/, embedCustom(interaction, 'Removed', '#0000FF', "Removed [`".concat(removeMe.name, "`](").concat(removeMe.url, ") from the queue."), {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null)];
                        }
                        return [3 /*break*/, 22];
                    case 16:
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else {
                            description = queue.songs.map(function (song, index) { return "".concat(index + 1, " - [`").concat(song.name, "`](").concat(song.url, ")\n"); });
                            maxTimes = Math.ceil(description.length / maxFields);
                            slicedDesc = [];
                            for (i = 0; i < maxTimes; i++) {
                                slicedDesc.push(description.slice(0, 20).join(''));
                                description = description.slice(20);
                            }
                            slicedDesc.forEach(function (m, index) { return __awaiter(_this, void 0, void 0, function () {
                                var embMsg;
                                return __generator(this, function (_a) {
                                    embMsg = new EmbedBuilder()
                                        .setTitle("Stormageddon Music Queue - ".concat(index + 1, " of ").concat(slicedDesc.length))
                                        .setColor('#0E4CB0')
                                        .setDescription(m)
                                        .setFooter({
                                        text: "Requested by ".concat(interaction.user.username),
                                        iconURL: null,
                                    })
                                        .setTimestamp();
                                    if (index > 0) {
                                        channel.send({ embeds: [embMsg] });
                                    }
                                    else {
                                        interaction.reply({ embeds: [embMsg] });
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        }
                        return [3 /*break*/, 22];
                    case 17:
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (queue.songs.length == 1) {
                            return [2 /*return*/, warnCustom(interaction, 'There is not another song in the queue.', module.name, client)];
                        }
                        else {
                            queue.shuffle();
                            embedCustom(interaction, 'Shuffled', '#0000FF', "Queue successfully shuffled.", {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 22];
                    case 18:
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (queue.songs.length == 1) {
                            return [2 /*return*/, warnCustom(interaction, 'There is not another song in the queue.', module.name, client)];
                        }
                        else {
                            song = queue.songs[0];
                            queue.skip().then(function () {
                                embedCustom(interaction, 'Skipped', '#0000FF', "[`".concat(song.name, "`](").concat(song.url, ") successfully skipped."), {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null);
                            });
                        }
                        return [3 /*break*/, 22];
                    case 19:
                        skip = interaction.options.getInteger('song');
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (skip < 2 || skip > queue.songs.length) {
                            return [2 /*return*/, warnCustom(interaction, "Number must be between 2 and ".concat(queue.songs.length), module.name, client)];
                        }
                        else if (!skip || isNaN(skip)) {
                            return [2 /*return*/, warnCustom(interaction, 'No song information was included in the command.', module.name, client)];
                        }
                        else {
                            queue.songs = queue.songs.splice(skip - 2);
                            queue.skip().then(function (s) {
                                embedCustom(interaction, 'Skipped', '#0000FF', "Skipped to [`".concat(s.name, "`](").concat(s.url, ")."), {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null);
                            });
                        }
                        return [3 /*break*/, 22];
                    case 20:
                        if (!queue || !queue.voiceChannel) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else {
                            queue.stop().then(function () {
                                queue.voice.leave();
                                embedCustom(interaction, 'Stop', '#0000FF', "Music Stopped.", {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null);
                            });
                        }
                        return [3 /*break*/, 22];
                    case 21:
                        volume = interaction.options.getNumber('song');
                        if (!queue) {
                            return [2 /*return*/, warnCustom(interaction, 'Nothing is playing right now.', module.name, client)];
                        }
                        else if (!volume) {
                            embedCustom(interaction, 'Volume', '#0000FF', "Volume is currently ".concat(queue.volume, "%."), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        else {
                            queue.setVolume(volume);
                            embedCustom(interaction, 'Volume', '#0000FF', "Volume changed to ".concat(queue.volume, "%."), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 22];
                    case 22: return [2 /*return*/];
                }
            });
        });
    },
    //#endregion
};
//#endregion
