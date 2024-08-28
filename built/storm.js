"use strict";
//#region Initial Set-Up
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//#region Dependencies
var discord_js_1 = require("discord.js");
var distube_1 = require("distube"); //sodium-native is used by this, stop deleting it you fool
var spotify_1 = require("@distube/spotify");
var soundcloud_1 = require("@distube/soundcloud");
var yt_dlp_1 = require("@distube/yt-dlp");
var youtube_1 = require("@distube/youtube");
var mongoose_1 = require("mongoose");
//#endregion
//#region Helpers
var createFiles_1 = require("./helpers/createFiles");
//#endregion
//Creates config and other required JSON files if they do not exist
(0, createFiles_1.createJSONfiles)();
//#region Internals
var settingsFunctions_1 = require("./internal/settingsFunctions");
var autoRole_1 = require("./internal/autoRole");
var messageHandling_1 = require("./internal/messageHandling");
var serverJoin_1 = require("./internal/serverJoin");
var distubeHandling_1 = require("./internal/distubeHandling");
var voiceHandling_1 = require("./internal/voiceHandling");
var slashCommandHandling_1 = require("./internal/slashCommandHandling");
var serverConfig_1 = require("./models/serverConfig");
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
//#region Initialize mongoDB/mongoose client
var db = mongoose_1.default.connect(process.env.mongoDBURI).then(function () {
    console.log('MongoDB Connected!');
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
    //Throws Error if bot's token is not set.
    if (process.env.authToken === 'YOUR BOT TOKEN' || process.env.authToken === '') {
        throw new Error("The 'authToken' property is not set in the .env file. Please do this!");
    }
    //Logs the bot into discord, using it's auth token
    client.login(process.env.authToken);
    //Logs the Bot info when bot starts
    client.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
        var serverConfigs, guild;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Logged in as ".concat(client.user.tag, "!"));
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.find({ guildID: { $nin: [] } }).exec()];
                case 1:
                    serverConfigs = _a.sent();
                    (0, autoRole_1.autoRoleListener)(client);
                    (0, messageHandling_1.messageHandling)(client, distube_2);
                    (0, messageHandling_1.PMHandling)(client, distube_2);
                    (0, serverJoin_1.serverJoin)(client);
                    (0, distubeHandling_1.setDiscordClient)(client);
                    (0, distubeHandling_1.musicHandle)(client, distube_2);
                    (0, voiceHandling_1.joinToCreateHandling)(client);
                    (0, slashCommandHandling_1.slashCommandHandling)(client, distube_2);
                    for (guild in serverConfigs) {
                        (0, slashCommandHandling_1.registerGuildSlashCommands)(serverConfigs[guild].guildID);
                    }
                    (0, slashCommandHandling_1.registerGlobalSlashCommands)();
                    client.user.setActivity("@me for more info and use the ! prefix when you dm me.");
                    return [2 /*return*/];
            }
        });
    }); });
    //Adds New Servers to Config
    client.on('guildCreate', function (newGuild) {
        (0, settingsFunctions_1.addServerConfig)(newGuild.id);
        (0, slashCommandHandling_1.registerGuildSlashCommands)(newGuild.id);
        console.log("Joined New Server: ".concat(newGuild.name, "#").concat(newGuild.id));
    });
    //Removes Server from Config
    client.on('guildDelete', function (oldGuild) {
        (0, settingsFunctions_1.removeServerConfig)(oldGuild.id);
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
