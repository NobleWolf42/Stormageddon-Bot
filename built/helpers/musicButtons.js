"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoplay = exports.shuffle = exports.noLoop = exports.loop = exports.repeat = exports.volumeUp = exports.volumeDown = exports.stop = exports.skip = exports.pause = void 0;
var discord_js_1 = require("discord.js");
var pause = new discord_js_1.ButtonBuilder().setCustomId('pause').setLabel('⏯️').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.pause = pause;
var skip = new discord_js_1.ButtonBuilder().setCustomId('skip').setLabel('⏭️').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.skip = skip;
var stop = new discord_js_1.ButtonBuilder().setCustomId('stop').setLabel('⏹️').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.stop = stop;
var volumeDown = new discord_js_1.ButtonBuilder().setCustomId('volDown').setLabel('🔉').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.volumeDown = volumeDown;
var volumeUp = new discord_js_1.ButtonBuilder().setCustomId('volUp').setLabel('🔊').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.volumeUp = volumeUp;
var repeat = new discord_js_1.ButtonBuilder().setCustomId('repeat').setLabel('🔁1️⃣').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.repeat = repeat;
var loop = new discord_js_1.ButtonBuilder().setCustomId('loop').setLabel('🔁').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.loop = loop;
var noLoop = new discord_js_1.ButtonBuilder().setCustomId('noLoop').setLabel('🔁🚫').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.noLoop = noLoop;
var shuffle = new discord_js_1.ButtonBuilder().setCustomId('shuffle').setLabel('🔀').setStyle(discord_js_1.ButtonStyle.Secondary);
exports.shuffle = shuffle;
var autoplay = new discord_js_1.ButtonBuilder().setCustomId('autoplay').setLabel(' ').setStyle(discord_js_1.ButtonStyle.Secondary).setEmoji('1259751959817093152');
exports.autoplay = autoplay;
