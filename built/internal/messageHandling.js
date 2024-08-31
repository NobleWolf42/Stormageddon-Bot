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
import { Collection } from 'discord.js';
import { activeCommands } from '../commands/activeCommands.js';
import { getRandomDoggo } from '../helpers/doggoLinks.js';
import { embedCustom, errorCustom, warnCustom } from '../helpers/embedMessages.js';
import { addToLog } from '../helpers/errorLog.js';
import { MongooseServerConfig } from '../models/serverConfig.js';
//#endregion
//Regex that tests for str (prefix)
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//#region Function for trying a command and catching the error if it fails
/**
 * This function tries a command and catches the error if it fails.
 * @param client - Discord.js Client Object
 * @param message - Discord.js Message Object
 * @param command - String of command keyword
 * @param args - Array of the words after the command keyword
 */
function tryCommand(client, message, command, args, distube) {
    try {
        command.execute(message, args, client, distube);
        if (message.channel.isDMBased()) {
            addToLog('success', command.name, message.author.tag, 'DM', 'DM');
        }
        else {
            addToLog('success', command.name, message.author.tag, message.guild.name, message.channel.name);
        }
    }
    catch (error) {
        if (message.channel.isDMBased()) {
            addToLog('success', command.name, message.author.tag, 'DM', 'DM');
        }
        else {
            addToLog('fatal error', command.name, message.author.tag, message.guild.name, message.channel.name, error, client);
        }
        errorCustom(message, `There was an error executing the ${command.name} command.`, command.name, client);
        console.log(error);
    }
}
//#endregion
//#region Function that starts the listener that handles executing all commands in servers
/**
 * This function starts the listener that handles executing all commands in a server.
 * @param client - Discord.js Client Object
 * @param distube - DisTube Client Object
 */
function messageHandling(client, distube, collections) {
    const coolDowns = new Collection();
    //#region Imports commands from ./commands
    for (let i = 0; i < activeCommands.length; i++) {
        const command = activeCommands[i];
        collections.commands.set(command.name, command);
    }
    //#endregion
    //Handles messages from guilds and their responses
    client.on('messageCreate', (message) => __awaiter(this, void 0, void 0, function* () {
        //#region Checks permissions
        // Make sure bots can't run commands
        if (message.author.bot)
            return;
        // Make sure the commands can only be run in a server
        if (message.channel.isDMBased())
            return;
        //#endregion
        //#region Sets prefix/defaultPrefix
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        var prefix = serverConfig.prefix;
        //#endregion
        //#region Handles all @ Commands
        if (message.mentions.users.first() !== undefined) {
            //@bot
            if (message.mentions.users.first().id === client.user.id) {
                if (serverConfig.setupNeeded) {
                    return embedCustom(message, `${client.user.tag}`, '#5D3FD3', `Please run \`${prefix}setup\` in an admin only chat channel to set up the bot on your server.`, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, getRandomDoggo(), [], null, null);
                }
                else {
                    return embedCustom(message, `${client.user.tag}`, '#5D3FD3', `Woof Woof, My Prefix is \`${prefix}\`, for more commands, please use the \`${prefix}help\` command.`, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, getRandomDoggo(), [], null, null);
                }
            }
        }
        //#endregion
        //#region honse responder
        if (message.content.toLowerCase().includes('honse')) {
            message.channel.send('https://i.imgur.com/hKZb0pc.png');
        }
        //#endregion
        //#region Handles all commands triggered by prefix
        //#region Prefix and Command Validation
        //Escapes if message does not start with prefix
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content))
            return;
        //Gets command name as typed by user
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        //Checks to see if it is a valid command and ignores message if it is not
        const command = collections.commands.get(commandName) || collections.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command)
            return;
        if (!command.type.includes('Guild'))
            return;
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
        if (command.name == 'setup' || command.name == 'test') {
            console.log(command.name);
            tryCommand(client, message, command, args, distube);
            return;
        }
        else if (serverConfig.setupNeeded) {
            return warnCustom(message, `You must set up the bot on this server before you can use commands. You can do this by using the \`${prefix}setup\` command in an Admin Only chat.`, command.name);
        }
        //#endregion
        tryCommand(client, message, command, args, distube);
        //#endregion
    }));
}
//#endregion
//#region Function that starts the listener that handles executing all commands in DMs
/**
 * This function starts the listener that handles executing all commands in DMs.
 * @param client - Discord.js Client Object
 * @param distube - DisTube Client Object
 */
function PMHandling(client, distube, collections) {
    client.on('messageCreate', (message) => {
        var prefix = '!';
        const coolDowns = new Collection();
        //#region Check permissions
        // Make sure the command can only be run in a PM
        if (!message.channel.isDMBased())
            return;
        // Make sure bots can't run this command
        if (message.author.bot)
            return;
        //#endregion
        //#region Handles all @ Commands
        if (message.mentions.users.first() !== undefined) {
            //@bot
            if (message.mentions.users.first().id === client.user.id) {
                return embedCustom(message, `${client.user.tag}`, '#5D3FD3', `Woof Woof, My Prefix is \`${prefix}\`, for more commands, please use the \`${prefix}help\` command.`, {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                }, getRandomDoggo(), [], null, null);
            }
        }
        //#endregion
        //#region Handles DM commands
        //#region Prefix and Command Validation
        //Escapes if message does not start with prefix
        const prefixRegex = new RegExp(`^(<@?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content))
            return;
        //Gets command name as typed by user
        const [, matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        //Checks to see if it is a valid command and ignores message if it is not
        const command = collections.commands.get(commandName) || collections.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
        if (!command)
            return;
        if (!command.type.includes('DM'))
            return;
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
            addToLog('success', command.name, message.author.tag, 'DM', 'Private Message');
        }
        catch (error) {
            addToLog('fatal error', command.name, message.author.tag, 'DM', 'Private Message', error, client);
            errorCustom(message, 'There was an error executing that command.', command.name, client);
            console.log(error);
        }
        //#endregion
    });
}
//#endregion
//#region exports
export { messageHandling, PMHandling };
//#endregion
