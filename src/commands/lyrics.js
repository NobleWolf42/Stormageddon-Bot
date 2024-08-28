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
    async execute(message, args, client, distube) {
        //Calls config from database
        var dbCall = await MongooseServerConfig.findById(message.guild.id).exec();
        var serverConfig = dbCall[0];

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
                const searches = await Genius.songs.search(queue.songs[0].name);
                var song = searches[0];
                lyrics = await song.lyrics();
                if (!lyrics) {
                    lyrics = `No lyrics found for ${queue.songs[0].name}.`;
                }
            } catch (error) {
                addToLog('fatal error', module.name, message.author.tag, message.guild.name, message.channel.name, error, client);
                lyrics = `No lyrics found for ${queue.songs[0].name}.`;
            }

            slicedLyrics = [];
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
            warnWrongChannel(message, serverConfig.music.textChannel, module.name);
        }
    },
};
//#endregion
