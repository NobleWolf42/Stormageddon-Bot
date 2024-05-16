//#region Initial Set-Up
    //#region Dependencies
    const { Client, GatewayIntentBits } = require('discord.js');
    //#endregion

    //#region Data Files
    const botConfig = require('./data/botConfig.json');
    //#endregion

    //#region Helpers
    const { createJSONfiles } = require('./helpers/createFiles.js');
    //#endregion

    //Creates config and other required JSON files if they do not exist
    createJSONfiles();

    //#region Internals
    const { addServerConfig, removeServerConfig } = require('./internal/settingsFunctions.js');
    const { autoRoleListener } = require('./internal/autoRole.js');
    const { PMHandling, messageHandling } = require('./internal/messageHandling.js');
    const { serverJoin } = require('./internal/serverJoin.js');
    //#endregion
//#endregion

//#region Initialize Discord Bot
const client = new Client({ intents: [
    GatewayIntentBits.DirectMessagePolls,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
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
  ]});
client.queue = new Map();
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
    messageHandling(client);
    PMHandling(client);
    serverJoin(client);
    client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
});

//Adds New Servers to Config
client.on("guildCreate", newGuild => {
    addServerConfig(newGuild.id);
    console.log(`Joined New Server: ${newGuild.name}#${newGuild.id}`);
})

//Removes Server from Config
client.on("guildDelete", oldGuild => {
    removeServerConfig(oldGuild.id);
    console.log(`Left Server: ${oldGuild.name}#${oldGuild.id}`);
})

//Logs Errors
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
//#endregion