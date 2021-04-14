//#region Initial Set-Up
    //#region Dependecies
    const { Client, Guild } = require('discord.js');
    //#endregion

    //#region Configs
    const botConfig = require('./data/botconfig.json');
    //#endregion

    //#region Helpers
    const { createJSONfiles } = require('./helpers/createfiles.js');
    createJSONfiles();
    //#endregion

    //#region Internals
    const { addServerConfig } = require('./internal/settingsFunctions.js');
    const { autoroleListener } = require('./internal/autorole.js');
    const { PMHandling, messageHandling } = require('./internal/messagehandling.js');
    const { serverJoin } = require('./internal/serverjoin.js');
    //#endregion
//#endregion

//#region Login / Initialize
// Initialize Discord Bot
const client = new Client();
client.queue = new Map();

//Throws Error if bot's token is not set.
if (botConfig.auth.token === 'YOUR BOT TOKEN' || botConfig.auth.token === '') {
    throw new Error("The 'auth.token' property is not set in the botconfig.json file. Please do this!");
}

//Logs the bot into discord, using it's auth token
client.login(botConfig.auth.token);

//Logs the Bot info when bot starts
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    autoroleListener(client);
    messageHandling(client);
    PMHandling(client);
    serverJoin(client);
    client.user.setActivity(`@me for more info and use the ! prefix when you dm me.`);
});

//Adds New Servers to Config
client.on("guildCreate", newGuild => {
    addServerConfig(newGuild.id);
})

//Removes Server from Config
client.on("guildDelete", oldGuild => {
    removeServerConfig(oldGuild.id);
})

//Logs Errors
client.on('warn', (info) => console.log(info));
client.on('error', console.error);
//#endregion