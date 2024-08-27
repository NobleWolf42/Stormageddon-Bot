var _a = require('discord.js'), ButtonBuilder = _a.ButtonBuilder, ButtonStyle = _a.ButtonStyle;
var pause = new ButtonBuilder()
    .setCustomId('pause')
    .setLabel('⏯️')
    .setStyle(ButtonStyle.Secondary);
var skip = new ButtonBuilder()
    .setCustomId('skip')
    .setLabel('⏭️')
    .setStyle(ButtonStyle.Secondary);
var stop = new ButtonBuilder()
    .setCustomId('stop')
    .setLabel('⏹️')
    .setStyle(ButtonStyle.Secondary);
var volumeDown = new ButtonBuilder()
    .setCustomId('volDown')
    .setLabel('🔉')
    .setStyle(ButtonStyle.Secondary);
var volumeUp = new ButtonBuilder()
    .setCustomId('volUp')
    .setLabel('🔊')
    .setStyle(ButtonStyle.Secondary);
var repeat = new ButtonBuilder()
    .setCustomId('repeat')
    .setLabel('🔁1️⃣')
    .setStyle(ButtonStyle.Secondary);
var loop = new ButtonBuilder()
    .setCustomId('loop')
    .setLabel('🔁')
    .setStyle(ButtonStyle.Secondary);
var noLoop = new ButtonBuilder()
    .setCustomId('noLoop')
    .setLabel('🔁🚫')
    .setStyle(ButtonStyle.Secondary);
var shuffle = new ButtonBuilder()
    .setCustomId('shuffle')
    .setLabel('🔀')
    .setStyle(ButtonStyle.Secondary);
var autoplay = new ButtonBuilder()
    .setCustomId('autoplay')
    .setLabel(' ')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('1259751959817093152');
module.exports = {
    pause: pause,
    skip: skip,
    stop: stop,
    volumeDown: volumeDown,
    volumeUp: volumeUp,
    repeat: repeat,
    loop: loop,
    noLoop: noLoop,
    shuffle: shuffle,
    autoplay: autoplay,
};
