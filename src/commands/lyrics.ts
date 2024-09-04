//#region Imports
import { Client as GeniusClient } from 'genius-lyrics';
import { addToLog } from '../helpers/errorLog.js';
import { embedCustom, warnCustom, warnDisabled, warnWrongChannel } from '../helpers/embedMessages.js';
import { Command } from '../models/commandModel.js';
import { LogType } from '../models/loggingModel.js';
//#endregion

//#region Initialization
const Genius = new GeniusClient();
//#endregion

//#region This exports the lyrics command with the information about it
const lyricsCommand: Command = {
    name: 'lyrics',
    type: ['Guild'],
    aliases: ['ly'],
    coolDown: 0,
    class: 'music',
    usage: 'lyrics',
    description: 'Gets the lyrics for the currently playing song.',
    async execute(message, args, client, distube, collections, serverConfig) {
        const channel = message.channel;

        if (channel.isDMBased()) {
            return;
        }

        if (!serverConfig.music.enable) {
            warnDisabled(message, 'music', this.name);
            return;
        }

        if (serverConfig.music.textChannel == channel.name) {
            var queue = distube.getQueue(message.guildId);
            if (!queue) {
                return warnCustom(message, 'There is nothing playing.', this.name);
            }

            var lyrics = null;

            try {
                const searches = await Genius.songs.search(queue.songs[0].name);
                var song = searches[0];
                lyrics = await song.lyrics();
                if (!lyrics) {
                    lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                }
            } catch (error) {
                addToLog(LogType.FatalError, this.name, message.author.tag, message.guild.name, channel.name, error, client);
                lyrics = `No lyrics found for ${queue.songs[0].name}.`;
            }

            let slicedLyrics: string[] = [];
            while (lyrics.length >= 2048) {
                slicedLyrics.push(`${lyrics.substring(0, 2045)}...`);
                lyrics = lyrics.slice(2045);
            }
            slicedLyrics.push(lyrics);

            slicedLyrics.forEach(async (m, index) => {
                embedCustom(
                    message,
                    `${song.fullTitle} - ${index + 1} of ${slicedLyrics.length}:`,
                    '#0E4CB0',
                    m,
                    {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    },
                    null,
                    [],
                    null,
                    null
                );
            });
        } else {
            warnWrongChannel(message, serverConfig.music.textChannel, this.name);
        }
    },
};
//#endregion

//#region Exports
export default lyricsCommand;
//#endregion
