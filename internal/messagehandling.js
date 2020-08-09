//#region Initalize
    //#region Dependancies
    const { Collection, MessageAttachment } = require('discord.js');
    const { readdirSync, readFileSync } = require('fs');
    const { join } = require("path");
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const { warnCustom, errorCustom } = require('../helpers/embedMessages.js');
    const { getRandomDoggo } = require('../helpers/doggoLinks.js');
    const { updateConfigFile } = require('../helpers/currentsettings.js');
    var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
    //#endregion
//#endregion

//#region Message Handling for Server
function messageHandling(client) {
    //
    client.commands = new Collection();
    const cooldowns = new Collection();

    //#region Gulid Commands Import
    const commandFiles = readdirSync(join(__dirname, "../commands")).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(join(__dirname, "../commands", `${file}`));
        client.commands.set(command.name, command);
    }
    //#endregion

    //Handels messages from guilds and their responses
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
        serverConfig = updateConfigFile();

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

            //@magma
            if(message.mentions.users.first().id === '211865015592943616') {
                var attachment = new MessageAttachment('https://cdn.discordapp.com/attachments/254389303294165003/702774952092237915/2Q.png');
                message.channel.send('IT\'S PIZZA TIME!!!');
                message.channel.send(attachment);
            }

            //@storm
            if(message.mentions.users.first().id === '645141555719569439') {
                var attachment = new MessageAttachment(getRandomDoggo());
                if (serverConfig[serverID] == undefined) {
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
            //console.log(command);
            if (!command.type.includes('Gulid')) return;
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
                    return warnCustom(message, `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            //#endregion

            try {
                command.execute(message, args, client);
            }
            catch (error) {
                console.error(error);
                errorCustom(message, "There was an error executing that command.");
            }
        //#endregion
    });
};



        /*//#region setup command
        if (!(serverID in serverConfig)) {
            if ((command == (prefix + 'setup')) && (serverAdmin)) {
                set.setup(message);
            }
            return;
        };
        //#endregion

        //#region setting commands
        if ((command == (prefix + 'set')) && (serverAdmin)) {

            if (userInput[1] == 'autorole') {
                serverConfig = set.setAutorole(message);
                return;
            }
            else if (userInput[1] == 'joinrole') {
                serverConfig = set.setJoinrole(message);
                return;
            }
            else if (userInput[1] == 'general') {
                serverConfig = set.setGeneral(message);
                return;
            }
            else if (userInput[1] == 'music') {
                serverConfig = set.setMusic(message);
                return;
            }
            else if (userInput[1] == 'modmail') {
                serverConfig = set.setModMail(message);
            }
            else {
                errormsg.custom(message, 'Invalid command, valid commands are `!set` `autorole, joinrole, general, modmail, and music`');
                return;
            }
        }
        else if ((command == (prefix + 'set')) && (!serverAdmin)) {
            errormsg.noServerAdmin(message);
        }
        //#endregion

        //#region addmod
        if (command == (prefix + 'addmod') && (adminTF) && (message.mentions.members.first() != undefined)) {
            // Call Torture helper function
            message.mentions.members.forEach((member) => {
                serverConfig = set.addMod(message, member);
            });
            return;
        }
        else if (command == (prefix + 'addmod') && (!adminTF)) {
            errormsg.noAdmin(message);
            return;
        }
        else if (command == (prefix + 'addmod') && (message.mentions.members.first() == undefined)) {
            errormsg.custom(message, 'You must specify a user to add as a Moderator. Command is !addmod @USERS.');
            return;
        }
        //#endregion
*/
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
                    return warnCustom(message, `Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
                }
            }

            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            //#endregion

            try {
                command.execute(message, args, client);
            }
            catch (error) {
                console.error(error);
                errorCustom(message, "There was an error executing that command.");
            }
        //#endregion
    })
}
//#endregion

//#region exports
module.exports = { messageHandling, PMHandling };
//#endregion