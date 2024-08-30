import { ButtonBuilder, ButtonStyle } from 'discord.js';

const pause = new ButtonBuilder().setCustomId('pause').setLabel('⏯️').setStyle(ButtonStyle.Secondary);

const skip = new ButtonBuilder().setCustomId('skip').setLabel('⏭️').setStyle(ButtonStyle.Secondary);

const stop = new ButtonBuilder().setCustomId('stop').setLabel('⏹️').setStyle(ButtonStyle.Secondary);

const volumeDown = new ButtonBuilder().setCustomId('volDown').setLabel('🔉').setStyle(ButtonStyle.Secondary);

const volumeUp = new ButtonBuilder().setCustomId('volUp').setLabel('🔊').setStyle(ButtonStyle.Secondary);

const repeat = new ButtonBuilder().setCustomId('repeat').setLabel('🔁1️⃣').setStyle(ButtonStyle.Secondary);

const loop = new ButtonBuilder().setCustomId('loop').setLabel('🔁').setStyle(ButtonStyle.Secondary);

const noLoop = new ButtonBuilder().setCustomId('noLoop').setLabel('🔁🚫').setStyle(ButtonStyle.Secondary);

const shuffle = new ButtonBuilder().setCustomId('shuffle').setLabel('🔀').setStyle(ButtonStyle.Secondary);

const autoplay = new ButtonBuilder().setCustomId('autoplay').setLabel(' ').setStyle(ButtonStyle.Secondary).setEmoji('1259751959817093152');

export { pause, skip, stop, volumeDown, volumeUp, repeat, loop, noLoop, shuffle, autoplay };
