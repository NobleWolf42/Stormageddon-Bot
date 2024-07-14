//#region Dependencies
const { Collection } = require('discord.js');
const { readdirSync, readFileSync } = require('fs');
const { join } = require("path");
//#endregion

//#region Helpers
const { warnCustom, errorCustom, embedCustom } = require('../helpers/embedMessages.js');
const { getRandomDoggo } = require('../helpers/doggoLinks.js');
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { addToLog } = require('../helpers/errorLog.js');
//#endregion

//Refreshing the serverConfig from serverConfig.json
var serverConfig = updateConfigFile();

//Regex that tests for str (prefix)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

//#region Function for trying a command and catching the error if it fails
/**
 * This function tries a command and catches the error if it fails.
 * @param {Client} client - Discord.js Client Object
 * @param {Message} message - Discord.js Message Object
 * @param {string} command - String of command keyword
 * @param {Array} args - Array of the words after the command keyword
 */
function tryCommand(client, message, command, args, distube) {
    try {
        command.execute(message, args, client, distube);
        addToLog('Success', command.name, message.author.tag, message.guild.name, message.channel.name);
    } catch (error) {
        addToLog('Fatal Error', command.name, message.author.tag, message.guild.name, message.channel.name, error, client);
        errorCustom(message, "There was an error executing that command.", command.name, client);
        console.log(error);
    }
}
//#endregion

//#region Function that starts the listener that handles executing all commands in servers
/**
 * This function starts the listener that handles executing all commands in a server.
 * @param {Client} client - Discord.js Client Object
 * @param {DisTube} distube - DisTube Client Object
 */
function messageHandling(client, distube) {
    client.commands = new Collection();
    const coolDowns = new Collection();

    //#region Imports commands from ./commands
    const commandFiles = readdirSync(join(__dirname, "../commands")).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(join(__dirname, "../commands", `${file}`));
        client.commands.set(command.name, command);
    }
    //#endregion

    //Handles messages from guilds and their responses
    client.on("messageCreate", message => {
        //#region Checks permissions
        // Make sure bots can't run commands
        if (message.author.bot) return;

        // Make sure the commands can only be run in a server
        if (!message.guild) return;
        //#endregion

        //#region Sets prefix/defaultPrefix
        var serverID = message.channel.guild.id;
        var prefixFile = JSON.parse(readFileSync('./data/botPrefix.json', 'utf8'));
        
        if (prefixFile[serverID] != undefined) {
            if (prefixFile[serverID].prefix != undefined) {
                var prefix = prefixFile[serverID].prefix;
            }
            else {
                var prefix = "!";
            }
        }
        else {
            var prefix = "!";
        }

        message.prefix = prefix;
        //#endregion

        //#region Handles all @ Commands
        if(message.mentions.users.first() !== undefined) {

            //@bot
            if(message.mentions.users.first().id === client.user.id) {
                if (serverConfig[serverID].setupNeeded) {
                    return embedCustom(message, `${client.user.tag}`, "#5D3FD3", `Please run \`${prefix}setup\` in an admin only chat channel to set up the bot on your server.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, getRandomDoggo(), [], null, null);
                }
                else {
                    return embedCustom(message, `${client.user.tag}`, "#5D3FD3", `Woof Woof, My Prefix is \`${prefix}\`, for more commands, please use the \`${prefix}help\` command.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, getRandomDoggo(), [], null, null);
                }
            }
        }
        //#endregion

        //#region honse responder
        if (message.content.toLowerCase().includes("honse")) {
            message.channel.send("https://i.imgur.com/hKZb0pc.png");
        }
        //#endregion

        //#region Handles all commands triggered by prefix
            //#region Prefix and Command Validation
            //Escapes if message does not start with prefix
            const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
            if (!prefixRegex.test(message.content)) return;
        
            //Gets command name as typed by user
            const [, matchedPrefix] = message.content.match(prefixRegex);
            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();

            //Checks to see if it is a valid command and ignores message if it is not
            const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return;

            if (!command.type.includes('Guild')) return;
            //#endregion

            //#region Anti-Spam (CoolDown) Code
            //Checks to see if command has a coolDown set and if it does executes the code to prevent overuse of command
            if (!coolDowns.has(command.name)) {
                coolDowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = coolDowns.get(command.name);
            const coolDownAmount = (command.coolDown || 1) * 1000;
        
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return warnCustom(message, `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, command.name);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);
            //#endregion

            //#region Checks to see if server is set up
            if (command.name == "setup") {
                tryCommand(client, message, command, args, distube);
                return
            } else if (serverConfig[serverID].setupNeeded) {
                return warnCustom(message, `You must set up the bot on this server before you can use commands. You can do this by using the \`${prefix}setup\` command in an Admin Only chat.`, command.name);
            }
            //#endregion

            tryCommand(client, message, command, args, distube);
        //#endregion
    });
};
//#endregion

//#region Function that starts the listener that handles executing all commands in DMs
/**
 * This function starts the listener that handles executing all commands in DMs.
 * @param {Client} client - Discord.js Client Object
 * @param {DisTube} distube - DisTube Client Object
 */
function PMHandling (client, distube) {
    client.on("messageCreate", message => {
        var prefix = '!';
        const coolDowns = new Collection();
        //#region Check permissions
        // Make sure the command can only be run in a PM
        if (message.guild) return;

        // Make sure bots can't run this command
        if (message.author.bot) return;
        //#endregion

        //#region Handles all @ Commands
        if(message.mentions.users.first() !== undefined) {

            //@bot
            if(message.mentions.users.first().id === client.user.id) {
                return embedCustom(message, `${client.user.tag}`, "#5D3FD3", `Woof Woof, My Prefix is \`${prefix}\`, for more commands, please use the \`${prefix}help\` command.`, { text: `Requested by ${message.author.tag}`, iconURL: null }, getRandomDoggo(), [], null, null);
            }
        }
        //#endregion

        //#region Handles DM commands
            //#region Prefix and Command Validation
            //Escapes if message does not start with prefix
            const prefixRegex = new RegExp(`^(<@?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
            if (!prefixRegex.test(message.content)) return;  
            //Gets command name as typed by user
            const [, matchedPrefix] = message.content.match(prefixRegex);
            const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            //Checks to see if it is a valid command and ignores message if it is not
            const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
            if (!command) return;
            if (!command.type.includes('DM')) return;
            //#endregion

            //#region Anti-Spam (CoolDown) Code
            //Checks to see if command has a coolDown set and if it does executes the code to prevent overuse of command
            if (!coolDowns.has(command.name)) {
                coolDowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = coolDowns.get(command.name);
            const coolDownAmount = (command.coolDown || 1) * 1000;
        
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + coolDownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return warnCustom(message, `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, command.name);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), coolDownAmount);
            //#endregion

            try {
                command.execute(message, args, client, distube);
                addToLog('Success', command.name, message.author.tag, "DM", "Private Message");
            }
            catch (error) {
                addToLog('Fatal Error', command.name, message.author.tag, "DM", "Private Message", error, client);
                errorCustom(message, "There was an error executing that command.", command.name, client);
                console.log(error);
            }
        //#endregion
    })
}
//#endregion

//#region exports
module.exports = { messageHandling, PMHandling };
//#endregion
