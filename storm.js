//#region Initial Set-Up

    //#region Dependencies
    const { Client, GatewayIntentBits, Partials } = require('discord.js');
    const { DisTube } = require("distube"); //sodium-native is used by this, stop deleting it you fool
    const { SpotifyPlugin } = require("@distube/spotify");
    const { SoundCloudPlugin } = require("@distube/soundcloud");
    const { YtDlpPlugin } = require("@distube/yt-dlp");
    const { YouTubePlugin } = require("@distube/youtube");
    //#endregion

    //#region Helpers
    const { createJSONfiles } = require('./helpers/createFiles.js');
    //#endregion

    //Creates config and other required JSON files if they do not exist
    createJSONfiles();

    //#region Data Files
    const botConfig = require('./data/botConfig.json');
    const serverConfig = require('./data/serverConfig.json');
    //#endregion


    //#region Internals
    const { addServerConfig, removeServerConfig } = require('./internal/settingsFunctions.js');
    const { autoRoleListener } = require('./internal/autoRole.js');
    const { PMHandling, messageHandling } = require('./internal/messageHandling.js');
    const { serverJoin } = require('./internal/serverJoin.js');
    const { musicHandle, setDiscordClient } = require('./internal/distubeHandling.js');
    const { joinToCreateHandling } = require('./internal/voiceHandling.js');
    const { slashCommandHandling, registerGuildSlashCommands, registerGlobalSlashCommands } = require('./internal/slashCommandHandling.js');
    //#endregion

//#endregion

//#region Initialize Discord Bot
const client = new Client({ 
    partials: [
        Partials.Channel,
        Partials.Message
    ],
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
        GatewayIntentBits.MessageContent
    ]
});
//#endregion

try{
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
              requestOptions: {
                // Configure request options for faster downloading
                maxRedirects: 5, // Increase maximum redirects
                timeout: 10000, // Set timeout for requests to avoid long waits
              },
            }),
        ]
    });
    //#endregion

    //Throws Error if bot's token is not set.
    if (botConfig.auth.token === 'YOUR BOT TOKEN' || botConfig.auth.token === '') {
        throw new Error("The 'auth.token' property is not set in the botConfig.json file. Please do this!");
    }

    //Logs the bot into discord, using it's auth token
    client.login(botConfig.auth.token);

    //Logs the Bot info when bot starts
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
        autoRoleListener(client);
        messageHandling(client, distube);
        PMHandling(client, distube);
        serverJoin(client);
        setDiscordClient(client);
        musicHandle(client, distube);
        joinToCreateHandling(client);
        slashCommandHandling(client, distube);
        for (guildId in serverConfig) {
            registerGuildSlashCommands(guildId);
        }
        registerGlobalSlashCommands();
        client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
    });

    //Adds New Servers to Config
    client.on("guildCreate", newGuild => {
        addServerConfig(newGuild.id);
        registerGuildSlashCommands(newGuild.id);
        console.log(`Joined New Server: ${newGuild.name}#${newGuild.id}`);
    })

    //Removes Server from Config
    client.on("guildDelete", oldGuild => {
        removeServerConfig(oldGuild.id);
        console.log(`Left Server: ${oldGuild.name}#${oldGuild.id}`);
    })
} catch (err) {
    console.log(err);
}

//Logs Errors
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
//#endregion