"use strict";
//#region Initial Set-Up
Object.defineProperty(exports, "__esModule", { value: true });
//#region Dependencies
var discord_js_1 = require("discord.js");
var distube_1 = require("distube"); //sodium-native is used by this, stop deleting it you fool
var spotify_1 = require("@distube/spotify");
var soundcloud_1 = require("@distube/soundcloud");
var yt_dlp_1 = require("@distube/yt-dlp");
var youtube_1 = require("@distube/youtube");
var mongodb_1 = require("mongodb");
//#endregion
//#region Helpers
var createFiles_js_1 = require("./helpers/createFiles.js");
//#endregion
//Creates config and other required JSON files if they do not exist
(0, createFiles_js_1.createJSONfiles)();
//#region Internals
var settingsFunctions_js_1 = require("./internal/settingsFunctions.js");
var autoRole_js_1 = require("./internal/autoRole.js");
var messageHandling_js_1 = require("./internal/messageHandling.js");
var serverJoin_js_1 = require("./internal/serverJoin.js");
var distubeHandling_js_1 = require("./internal/distubeHandling.js");
var voiceHandling_js_1 = require("./internal/voiceHandling.js");
var slashCommandHandling_js_1 = require("./internal/slashCommandHandling.js");
//#endregion
//#endregion
//#region Initialize Discord Bot
var client = new discord_js_1.Client({
    partials: [discord_js_1.Partials.Channel, discord_js_1.Partials.Message],
    intents: [
        discord_js_1.GatewayIntentBits.DirectMessagePolls,
        discord_js_1.GatewayIntentBits.DirectMessageReactions,
        discord_js_1.GatewayIntentBits.DirectMessageTyping,
        discord_js_1.GatewayIntentBits.DirectMessages,
        discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
        discord_js_1.GatewayIntentBits.GuildIntegrations, //might not uses this, see if we need it for the future or delete it
        discord_js_1.GatewayIntentBits.GuildInvites,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessagePolls,
        discord_js_1.GatewayIntentBits.GuildMessageReactions,
        discord_js_1.GatewayIntentBits.GuildMessageTyping,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.GuildModeration,
        discord_js_1.GatewayIntentBits.GuildPresences,
        discord_js_1.GatewayIntentBits.GuildScheduledEvents,
        discord_js_1.GatewayIntentBits.GuildVoiceStates,
        discord_js_1.GatewayIntentBits.GuildWebhooks,
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
//#endregion
try {
    //#region Initialize Distube(music) Functionality
    var distube_2 = new distube_1.DisTube(client, {
        emitNewSongOnly: false,
        savePreviousSongs: true,
        plugins: [
            // Spotify Plugin with optimizations
            new spotify_1.SpotifyPlugin(),
            new soundcloud_1.SoundCloudPlugin(), // SoundCloud Plugin remains the same
            new youtube_1.YouTubePlugin(),
            // YouTube DL Plugin with optimizations
            new yt_dlp_1.YtDlpPlugin({
                update: true, // Update youtube-dl automatically
            }),
        ],
    });
    //#endregion
    //#region Initialize mongoDB client
    var mongoDBClient = new mongodb_1.MongoClient(process.env.mongoDBURI, {
        serverApi: {
            version: mongodb_1.ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
    //#endregion
    //Throws Error if bot's token is not set.
    if (process.env.authToken === 'YOUR BOT TOKEN' || process.env.authToken === '') {
        throw new Error("The 'authToken' property is not set in the .env file. Please do this!");
    }
    //Logs the bot into discord, using it's auth token
    client.login(process.env.authToken);
    var mongoDatabase = mongoDBClient.db('server-configs');
    var guilds = mongoDatabase.collection('guildIDs');
    var serverConfigs_1 = guilds.find({ guildID: { $nin: [] } });
    console.log(guilds);
    //Logs the Bot info when bot starts
    client.on('ready', function () {
        console.log("Logged in as ".concat(client.user.tag, "!"));
        (0, autoRole_js_1.autoRoleListener)(client);
        (0, messageHandling_js_1.messageHandling)(client, distube_2);
        (0, messageHandling_js_1.PMHandling)(client, distube_2);
        (0, serverJoin_js_1.serverJoin)(client);
        (0, distubeHandling_js_1.setDiscordClient)(client);
        (0, distubeHandling_js_1.musicHandle)(client, distube_2);
        (0, voiceHandling_js_1.joinToCreateHandling)(client);
        (0, slashCommandHandling_js_1.slashCommandHandling)(client, distube_2);
        for (guildId in serverConfigs_1) {
            (0, slashCommandHandling_js_1.registerGuildSlashCommands)(guildId);
        }
        (0, slashCommandHandling_js_1.registerGlobalSlashCommands)();
        client.user.setActivity("@me for more info and use the ! prefix when you dm me.");
    });
    //Adds New Servers to Config
    client.on('guildCreate', function (newGuild) {
        (0, settingsFunctions_js_1.addServerConfig)(newGuild.id);
        (0, slashCommandHandling_js_1.registerGuildSlashCommands)(newGuild.id);
        console.log("Joined New Server: ".concat(newGuild.name, "#").concat(newGuild.id));
    });
    //Removes Server from Config
    client.on('guildDelete', function (oldGuild) {
        (0, settingsFunctions_js_1.removeServerConfig)(oldGuild.id);
        console.log("Left Server: ".concat(oldGuild.name, "#").concat(oldGuild.id));
    });
}
catch (err) {
    console.log(err);
}
//Logs Errors
client.on('warn', function (info) { return console.log(info); });
client.on('error', console.error);
//#endregion
