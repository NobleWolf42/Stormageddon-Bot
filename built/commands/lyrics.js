var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Imports
import { Client as GeniusClient } from 'genius-lyrics';
import { addToLog } from '../helpers/errorLog.js';
import { embedCustom, warnCustom, warnDisabled, warnWrongChannel } from '../helpers/embedMessages.js';
import { LogType } from '../models/loggingModel.js';
//#endregion
//#region Initialization
const Genius = new GeniusClient();
//#endregion
//#region This exports the lyrics command with the information about it
const lyricsCommand = {
    name: 'lyrics',
    type: ['Guild'],
    aliases: ['ly'],
    coolDown: 0,
    class: 'music',
    usage: 'lyrics',
    description: 'Gets the lyrics for the currently playing song.',
    execute(message, args, client, distube, collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    const searches = yield Genius.songs.search(queue.songs[0].name);
                    var song = searches[0];
                    lyrics = yield song.lyrics();
                    if (!lyrics) {
                        lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                    }
                }
                catch (error) {
                    addToLog(LogType.FatalError, this.name, message.author.tag, message.guild.name, channel.name, error, client);
                    lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                }
                let slicedLyrics = [];
                while (lyrics.length >= 2048) {
                    slicedLyrics.push(`${lyrics.substring(0, 2045)}...`);
                    lyrics = lyrics.slice(2045);
                }
                slicedLyrics.push(lyrics);
                slicedLyrics.forEach((m, index) => __awaiter(this, void 0, void 0, function* () {
                    embedCustom(message, `${song.fullTitle} - ${index + 1} of ${slicedLyrics.length}:`, '#0E4CB0', m, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                }));
            }
            else {
                warnWrongChannel(message, serverConfig.music.textChannel, this.name);
            }
        });
    },
};
//#endregion
//#region Exports
export default lyricsCommand;
//#endregion
