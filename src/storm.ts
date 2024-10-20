//#region Imports
import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { YouTubePlugin } from '@distube/youtube';
import { DeezerPlugin } from '@distube/deezer';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import { DisTube } from 'distube';
import mongoose from 'mongoose';
import { createJSONfiles } from './helpers/createFiles.js';
import { autoRoleListener } from './internal/autoRole.js';
import { musicHandler } from './internal/distubeHandling.js';
import { PMHandling, messageHandling } from './internal/messageHandling.js';
import { serverJoin } from './internal/serverJoin.js';
import { addServerConfig, removeServerConfig } from './internal/settingsFunctions.js';
import { registerGlobalSlashCommands, registerGuildSlashCommands, slashCommandHandling } from './internal/slashCommandHandling.js';
import { joinToCreateHandling } from './internal/voiceHandling.js';
import { ExtraCollections } from './models/extraCollectionsModel.js';
import { MongooseServerConfig } from './models/serverConfigModel.js';
import { logMessageUpdate, logVoiceUpdate, logAdminUpdate, logUserUpdate } from './internal/moderatorLogging.js';
//#endregion

console.log('Starting Bot...');

createJSONfiles();

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

//#region Initialize mongoDB/mongoose client
mongoose
    .connect(process.env.mongoDBURI)
    .then(() => {
        console.log('Connecting to MongoDB');
        console.log('... OK');
    })
    .catch((err) => {
        console.log('Connecting to MongoDB');
        console.log('... Failed');
        console.log(err);
        console.log('');
    });
mongoose.set('debug', true);
//#endregion

//#region Initialize ExtraCollections
const extraColl = new ExtraCollections();
//#endregion

try {
    //#region Initialize Distube(music) Functionality
    //FIX this error in the future, distube and discordjs hate each other apparently
    console.log('Starting Distube');
    const distube = new DisTube(client, {
        emitNewSongOnly: false,
        savePreviousSongs: false,
        plugins: [
            new SpotifyPlugin(),
            new SoundCloudPlugin(),
            new YouTubePlugin(),
            new DeezerPlugin(),
            // YouTube DL Plugin with optimizations
            new YtDlpPlugin({
                update: true, // Update youtube-dl automatically
            }),
        ],
    });
    console.log('... OK');
    //#endregion

    //Throws Error if bot's token is not set.
    if (process.env.authToken === 'YOUR BOT TOKEN' || process.env.authToken === '') {
        throw new Error("The 'authToken' property is not set in the .env file. Please do this!");
    }

    //Logs the bot into discord, using it's auth token
    client.login(process.env.authToken);

    //Logs the Bot info when bot starts
    client.on(Events.ClientReady, async () => {
        console.log('Logging into Discord');
        console.log('...OK');
        const serverConfigs = await MongooseServerConfig.find({ guildID: { $nin: [] } }).exec();
        console.log('Starting AutoRole Listener');
        await autoRoleListener(client);
        console.log('Starting Guild Message Listener');
        messageHandling(client, distube, extraColl);
        console.log('Starting Private Message Listener');
        PMHandling(client, distube, extraColl);
        console.log('Starting ServerJoin Listener');
        serverJoin(client);
        console.log('Starting Music Listener');
        await musicHandler(client, distube);
        console.log('Starting Join To Create Channel Listener');
        await joinToCreateHandling(client, extraColl);
        console.log('Starting Slash Command Listener');
        await slashCommandHandling(client, distube, extraColl);
        console.log('Starting Message Logging Listener');
        await logMessageUpdate(client);
        console.log('Starting Voice Logging Listener');
        await logVoiceUpdate(client);
        console.log('Starting Admin Logging Listener');
        await logAdminUpdate(client);
        console.log('Starting User Logging Listener');
        await logUserUpdate(client);
        client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
        console.log('Bot Startup Complete!');
        console.log(`Logged in as ${client.user.tag}!`);
        console.log('');
        registerGlobalSlashCommands();
        for (const guild in serverConfigs) {
            registerGuildSlashCommands(serverConfigs[guild].guildID, client);
        }
    });

    //Adds New Servers to Config
    client.on(Events.GuildCreate, (newGuild) => {
        addServerConfig(newGuild.id);
        registerGuildSlashCommands(newGuild.id, client);
        console.log(`Joined New Server: ${newGuild.name}#${newGuild.id}`);
    });

    //Removes Server from Config
    client.on(Events.GuildDelete, (oldGuild) => {
        removeServerConfig(oldGuild.id);
        console.log(`Left Server: ${oldGuild.name}#${oldGuild.id}`);
    });
} catch (err) {
    console.log(err);
}

//#region Error Handling
client.on(Events.Warn, (info) => console.log(info));
client.on(Events.Error, console.error);
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection', err);
});
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception', err);
});
//#endregion
//#endregion
