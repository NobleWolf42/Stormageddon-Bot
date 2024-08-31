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
const GeniusLyrics = require('genius-lyrics');
const Genius = new GeniusLyrics.Client();
//#endregion
//#region Helpers
const { addToLog } = require('../helpers/errorLog.js');
const { embedCustom, warnCustom, warnDisabled, warnWrongChannel } = require('../helpers/embedMessages.js');
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
//#endregion
//#region This exports the lyrics command with the information about it
module.exports = {
    name: 'lyrics',
    type: ['Guild'],
    aliases: ['ly'],
    coolDown: 0,
    class: 'music',
    usage: 'lyrics',
    description: 'Gets the lyrics for the currently playing song.',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            //Calls config from database
            var serverConfig = (yield MongooseServerConfig.findById(message.guild.id).exec()).toObject();
            if (!serverConfig.music.enable) {
                warnDisabled(message, 'music', module.name);
                return;
            }
            if (serverConfig.music.textChannel == message.channel.name) {
                var queue = distube.getQueue(message);
                if (!queue) {
                    return warnCustom(message, 'There is nothing playing.', module.name);
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
                    addToLog('fatal error', module.name, message.author.tag, message.guild.name, message.channel.name, error, client);
                    lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                }
                slicedLyrics = [];
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
                warnWrongChannel(message, serverConfig.music.textChannel, module.name);
            }
        });
    },
};
//#endregion
