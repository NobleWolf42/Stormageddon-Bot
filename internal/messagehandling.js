//#region Dependencies
    const { Collection, MessageAttachment } = require('discord.js');
    const { readdirSync, readFileSync } = require('fs');
    const { join } = require("path");
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const { warnCustom, errorCustom } = require('../helpers/embedMessages.js');
    const { getRandomDoggo } = require('../helpers/doggoLinks.js');
    const { updateConfigFile } = require('../helpers/currentsettings.js');
    const { addToLog } = require('../helpers/errorlog.js');
    var serverConfig = updateConfigFile();
//#endregion

//#region Function for trying a command and catching the error if it fails
function trycommand(client, message, command, args) {
    try {
        command.execute(message, args, client);
        addToLog('Success', command.name, message.author.tag, message.guild.name, message.channel.name);
    }
    catch (error) {
        addToLog('Fatal Error', command.name, message.author.tag, message.guild.name, message.channel.name, error, client);
        errorCustom(message, "There was an error executing that command.", command.name);
        console.log(error);
    }
}
//#endregion

//#region Message Handling for Server
function messageHandling(client) {

    client.commands = new Collection();
    const cooldowns = new Collection();

    //#region Commands Import
    const commandFiles = readdirSync(join(__dirname, "../commands")).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(join(__dirname, "../commands", `${file}`));
        client.commands.set(command.name, command);
    }
    //#endregion

    //Handles messages from guilds and their responses
    client.on("message", message => {

        //#region Permission Checks
        // Make sure bots can't run commands
        if (message.author.bot) return;

        // Make sure the commands can only be run in a server
        if (!message.guild) return;
        //#endregion

        //#region prefix/defaultprefix set
        var serverID = message.channel.guild.id;
        var prefixFile = JSON.parse(readFileSync('./data/botprefix.json', 'utf8'));

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

        //#region for all @ Commands
        if(message.mentions.users.first() !== undefined) {

            //@storm
            if(message.mentions.users.first().id === client.user.id) {
                var attachment = new MessageAttachment(getRandomDoggo());
                if (serverConfig[serverID].setupneeded) {
                    message.channel.send(`Please run \`${prefix}setup\` in an admin only chat channel to set up the bot on your server.`);
                    message.channel.send(attachment);
                }
                else {
                    message.channel.send(`Woof Woof, My Prefix is \`${prefix}\`, for more commands, please use the \`${prefix}help\` command.`);
                    message.channel.send(attachment);
                }
                return;
            }
        }
        //#endregion

        //#region Command Handeling
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

            //#region Anti-Spam (Cooldown) Code
            //Checks to see if command has a cooldown set and if it does executes the code to prevent overuse of command
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;
        
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return warnCustom(message, `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, command.name);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            //#endregion

            //#region Checks to see if server is set up
            if (command.name == "setup") {
                trycommand(client, message, command, args);
                return
            }
            else if (serverConfig[serverID].setupneeded) {
                return warnCustom(message, `You Must set up the bot on this server before you can use commands. You can do this by using the \`${prefix}setup\` command in and Admin Only chat.`, command.name);
            }
            //#endregion

            trycommand(client, message, command, args);
        //#endregion
    });
};
//#endregion

//#region Message Handling for PM
function PMHandling (client) {
    client.on("message", message => {
        var prefix = '!';
        const cooldowns = new Collection();

        //#region Permission Checks
        // Make sure the command can only be run in a PM
        if (message.guild) return;

        // Make sure bots can't run this command
        if (message.author.bot) return;
        //#endregion

        //#region DM Command Handeling
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
            if (!command.type.includes('DM')) return;
            //#endregion

            //#region Anti-Spam (Cooldown) Code
            //Checks to see if command has a cooldown set and if it does executes the code to prevent oveuse of command
            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;
        
            if (timestamps.has(message.author.id)) {
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return warnCustom(message, `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`, command.name);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            //#endregion

            try {
                command.execute(message, args, client);
                addToLog('Success', command.name, message.author.tag, "DM", "Private Message");
            }
            catch (error) {
                addToLog('Fatal Error', command.name, message.author.tag, "DM", "Private Message", error, client);
                errorCustom(message, "There was an error executing that command.", command.name);
                console.log(error);
            }
        //#endregion
    })
}
//#endregion

//#region exports
module.exports = { messageHandling, PMHandling };
//#endregion