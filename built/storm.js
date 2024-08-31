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
import { SoundCloudPlugin } from '@distube/soundcloud';
import { SpotifyPlugin } from '@distube/spotify';
import { YouTubePlugin } from '@distube/youtube';
import { YtDlpPlugin } from '@distube/yt-dlp';
import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { DisTube } from 'distube'; //sodium-native is used by this, stop deleting it you fool
import mongoose from 'mongoose';
import { createJSONfiles } from './helpers/createFiles.js';
import { autoRoleListener } from './internal/autoRole.js';
import { musicHandle, setDiscordClient } from './internal/distubeHandling.js';
import { PMHandling, messageHandling } from './internal/messageHandling.js';
import { serverJoin } from './internal/serverJoin.js';
import { addServerConfig, removeServerConfig } from './internal/settingsFunctions.js';
import { registerGlobalSlashCommands, registerGuildSlashCommands, slashCommandHandling } from './internal/slashCommandHandling.js';
import { joinToCreateHandling } from './internal/voiceHandling.js';
import { MongooseServerConfig } from './models/serverConfig.js';
//#endregion
createJSONfiles();
//#region Initialize Discord Bot
const ogClient = new Client({
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
const client = ogClient;
//#endregion
//#region Initialize mongoDB/mongoose client
const db = mongoose.connect(process.env.mongoDBURI).then(() => {
    console.log('MongoDB Connected!');
});
//#endregion
try {
    //#region Initialize Distube(music) Functionality
    const distube = new DisTube(ogClient, {
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
    client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(`Logged in as ${client.user.tag}!`);
        var serverConfigs = yield MongooseServerConfig.find({ guildID: { $nin: [] } }).exec();
        autoRoleListener(client);
        messageHandling(client, distube);
        PMHandling(client, distube);
        serverJoin(client);
        setDiscordClient(client);
        musicHandle(client, distube);
        joinToCreateHandling(client);
        slashCommandHandling(client, distube);
        for (var guild in serverConfigs) {
            registerGuildSlashCommands(serverConfigs[guild].guildID);
        }
        registerGlobalSlashCommands();
        client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
    }));
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
}
catch (err) {
    console.log(err);
}
//Logs Errors
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
//#endregion
