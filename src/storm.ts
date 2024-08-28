//#region Initial Set-Up

//#region Dependencies
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { DisTube } from 'distube'; //sodium-native is used by this, stop deleting it you fool
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { YouTubePlugin } from '@distube/youtube';
import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';
//#endregion

//#region Helpers
import { createJSONfiles } from './helpers/createFiles.js';
//#endregion

//Creates config and other required JSON files if they do not exist
createJSONfiles();

//#region Internals
import { addServerConfig, removeServerConfig } from './internal/settingsFunctions.js';
import { autoRoleListener } from './internal/autoRole.js';
import { PMHandling, messageHandling } from './internal/messageHandling.js';
import { serverJoin } from './internal/serverJoin.js';
import { musicHandle, setDiscordClient } from './internal/distubeHandling.js';
import { joinToCreateHandling } from './internal/voiceHandling.js';
import { slashCommandHandling, registerGuildSlashCommands, registerGlobalSlashCommands } from './internal/slashCommandHandling.js';
//#endregion

//#endregion

//#region Initialize Discord Bot
const client = new Client({
    partials: [Partials.Channel, Partials.Message],
    intents: [
        GatewayIntentBits.DirectMessagePolls,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations, //might not uses this, see if we need it for the future or delete it
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessagePolls,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
});
//#endregion

//#region Initialize mongoDB client
export const db = mongoose.connect(process.env.mongoDBURI).then(() => {
    console.log('mongodb connected!');
});

// const mongoDBClient = new MongoClient(process.env.mongoDBURI, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     },
// });
//#endregion

//#region function to load db and Return list of servers currently using bot
/**
 *
 * @returns
 */
async function dbLoad() {
    // const mongoCollection = mongoDBClient.db('server-configs').collection('guildIDs');
    // const serverConfigs = await mongoCollection.find({ guildID: { $nin: [] } });
    // console.log(serverConfigs);
    // return serverConfigs;
}
//#endregion

try {
    //#region Initialize Distube(music) Functionality
    const distube = new DisTube(client, {
        emitNewSongOnly: false,
        savePreviousSongs: true,
        plugins: [
            // Spotify Plugin with optimizations
            new SpotifyPlugin(),
            new SoundCloudPlugin(), // SoundCloud Plugin remains the same
            new YouTubePlugin(),
            // YouTube DL Plugin with optimizations
            new YtDlpPlugin({
                update: true, // Update youtube-dl automatically
            }),
        ],
    });
    //#endregion

    //Throws Error if bot's token is not set.
    if (process.env.authToken === 'YOUR BOT TOKEN' || process.env.authToken === '') {
        throw new Error("The 'authToken' property is not set in the .env file. Please do this!");
    }

    //Logs the bot into discord, using it's auth token
    client.login(process.env.authToken);

    //Logs the Bot info when bot starts
    client.on('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        var serverConfigs = await dbLoad();
        autoRoleListener(client);
        messageHandling(client, distube);
        PMHandling(client, distube);
        serverJoin(client);
        setDiscordClient(client);
        musicHandle(client, distube);
        joinToCreateHandling(client);
        slashCommandHandling(client, distube);
        for (guildId in serverConfigs) {
            registerGuildSlashCommands(guildId);
        }
        registerGlobalSlashCommands();
        client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
    });

    //Adds New Servers to Config
    client.on('guildCreate', (newGuild) => {
        addServerConfig(newGuild.id);
        registerGuildSlashCommands(newGuild.id);
        console.log(`Joined New Server: ${newGuild.name}#${newGuild.id}`);
    });

    //Removes Server from Config
    client.on('guildDelete', (oldGuild) => {
        removeServerConfig(oldGuild.id);
        console.log(`Left Server: ${oldGuild.name}#${oldGuild.id}`);
    });
} catch (err) {
    console.log(err);
}

//Logs Errors
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
//#endregion
