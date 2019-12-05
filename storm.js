//#region Initial set-up
    //#region dependecies
    var Discord = require('discord.js');
    var fs = require("fs");

    var DoggoLinks = require('./helpers/doggoLinks.js');

    var cmdObj = require('./data/commands.json');
    var config = require('./config.json');

    var Agify = require('./commands/agify.js');
    var Clear = require('./commands/clear.js');
    var Destiny2Commands = require('./commands/destiny2.js');
    var ISS = require('./commands/iss.js');
    var Quote = require('./commands/quote.js');
    var Torture = require('./commands/torture.js');
    var Music = require('./commands/music.js');
    var AutoRole = require('./commands/autorole.js');
    //#endregion

    //#region initializing
    var adminRoleIDs = [];
    var djRoleIDs = [];
    var prefixFile = {};
    var modRoleIDs = [];
    //#endregion
//#endregion

//#region Creates missing files on start
function createJSONfiles() {

    var emptyFile = {};

    if (!fs.existsSync("./botprefix.json")) {
        fs.writeFile("botprefix.json", JSON.stringify(emptyFile), function(err) {
            if (err) {
                console.log(err);
            }
        });
    }

    updateFilevaribles();
}

function updateFilevaribles(){
    prefixFile = require('./botprefix.json');
}
//#endregion

//#region Login / Initialize
// Initialize Discord Bot
var client = new Discord.Client();

//Throws Error if bot's token is not set.
if (config.auth.token === 'YOUR BOT TOKEN' || config.auth.token === '') {
    throw new Error("The 'auth.token' property is not set in the config.js file. Please do this!");
}

//Logs the bot into discord, using it's auth token
client.login(config.auth.token);

//Logs the Bot info when bot starts
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    createJSONfiles();
    client.user.setPresence({ game: { name: `Use !help to show commands` } });
});

//Logs Errors
client.on('error', console.error);

//#endregion

//#region Server Roles
//Function that calls the server roles
function serverRoleUpdate(sRole, serverid) {
    
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops throught the Admin Role Names, pushing them to an array
    for (key in config[serverid].general.adminRoles) {
        
        //Pushes role IDs to Admin if they Match config[serverid].general.adminRoles
        if (basicServerRoles[config[serverid].general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[config[serverid].general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pushing them to an array
    for (key in config[serverid].general.modRoles) {
        
        //Pushes role IDs to Mods if they Match config[serverid].general.modRoles
        if (basicServerRoles[config[serverid].general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[config[serverid].general.modRoles[key]]);
        }
    }

    //Loops throught the DJ Role Names, pushing them to an array
    for (key in config[serverid].music.djRoles) {
        
        //Pushes role IDs to DJs if they Match config[serverid].music.djRoles
        if (basicServerRoles[config[serverid].music.djRoles[key]]){
            djRoleIDs.push(basicServerRoles[config[serverid].music.djRoles[key]]);
        }
    }
}

//#endregion

//#region Admin / Mod / DJ Check
//Function that returns boolean for if the user who sent the message is an Admin (based off config[serverid].connection.adminRoles)
function adminCheck(userRolesArray, serverRolesArray, serverid) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if any of the user role ids match any of the admin role ids
    for (key in userRolesArray) {
        
        for (a in adminRoleIDs) {

            if (userRolesArray[key] == adminRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a Moderator (based off config[serverid].connection.modRoles)
function modCheck(userRolesArray, serverRolesArray, serverid) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in modRoleIDs) {

            if (userRolesArray[key] == modRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a DJ (based off config[serverid].connection.djRole)
function djCheck(userRolesArray, serverRolesArray, serverid) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in djRoleIDs) {

            if (userRolesArray[key] == djRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//#endregion

//#region Message Handling
//Handels Messages and their responses
client.on("message", message => {

    //#region Permission Checks
    // Make sure bots can't run this command
    if (message.author.bot) return;

    // Make sure the command can only be run in a server
    if (!message.guild) return;
    //#endregion

    //#region Varibles for the message info needed
    var serverid = message.channel.guild.id;
    var userInputNoLower = message.content.split(' ');
    var userInput = message.content.toLowerCase().split(' ');
    var noncommand = '';
    var command = userInput[0];
    var userRoles = message.author.lastMessage.member._roles;
    var serverRoles = message.channel.guild.roles;
    var adminTF = adminCheck(userRoles, serverRoles, serverid);
    var modTF = modCheck(userRoles, serverRoles, serverid);
    var djTF = djCheck(userRoles, serverRoles, serverid);
    
    if (prefixFile[serverid] != undefined) {
        if (prefixFile[serverid].prefix != undefined) {
            var prefix = prefixFile[serverid].prefix;
        }
        else {
            var prefix = "!";
        }
    }
    else {
        var prefix = "!";
    }

    for (i = 1; i <= userInputNoLower.length; i++) {
        if (userInputNoLower.length != 2) {
            if (i < (userInputNoLower.length - 1)) {
                noncommand += (userInputNoLower[i] + ' ');
            }
            else {
                noncommand += userInputNoLower[i-1];
            }
        }
        else {
            if (userInputNoLower[i] != undefined) {
                noncommand += userInputNoLower[i];
            }
        }
    }
    //#endregion

    //#region replys to meow/mew/cat/kitty/squirrel
    if((userInput.includes('meow')) || (userInput.includes('mew')) || (userInput.includes('cat')) || (userInput.includes('kitty')) || (userInput.includes('squirrel'))) {
        var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());

        message.channel.send("Bork Bork Bork Bork Bork");
        message.channel.send(attachment);

        setIntervalTimes(function () {
            var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());

            message.author.send("Bork Bork Bork Bork Bork");
            message.author.send(attachment);
        }, 5000, 7)
    }
    //#endregion

    //#region for all @ Commands
    if(message.mentions.users.first() !== undefined) {

        //@magma
        if(message.mentions.users.first().id === '211865015592943616') {
            var attachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/254389303294165003/649734083366223895/kji50lq4nhq11.png');
            message.channel.send('Nep Nep Nep Nep Nep Nep Nep');
            message.channel.send(attachment);
        }

        //@storm
        if(message.mentions.users.first().id === '645141555719569439') {
            var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());
            message.channel.send('Woof Woof');
            message.channel.send(attachment);
        }
    }
    //#endregion

    //Everything after this point requires a prefix
    if (!message.content.startsWith(prefix)) return;

    //#region AutoRole Commands
    //Runs AutoRole Message Generation
    if ((command === (prefix + 'createautorolemsg') && (adminTF === true))){
        AutoRole.sendRoleMessage(message, serverid, client);
        message.delete().catch(O_o=>{});
        return;
    };
    //#endregion

    //#region Register
    if (command == (prefix + 'register')) {
        refreshUser();
        if (message.author.id in userAccountInfo) {
            var txt = `You Have Already Registered.\nThe last time you updated your info was ${userAccountInfo[message.author.id].time}\n If you wish to update you info now, please click on this link: ${config.general.registerLink}`;
            var color = 2385434;
        }
        else {
            var txt = `Click on this link to register: ${config.general.registerLink}`;
            var color = 0xb50000;
        }


        const embMsg = new Discord.RichEmbed()
            .setTitle('Register')
            .setColor(color)
            .setDescription(txt);
        message.author.send(embMsg);
        message.delete().catch(O_o=>{})
        return;
    }
    //#endregion

    //#region Music Bot Commands
    if (((command == (prefix + 'play') || (command == (prefix + 'skip')) || (command == (prefix + 'stop')) || (command == (prefix + 'pause')) || (command == (prefix + 'resume'))) && (djTF == false))) {
        message.reply(`You do not have access to this command, To gain acces to this command you must have a DJ Role.`);
        return;
    }
    else if ((command == (prefix + 'volume')) && (modTF == false)) {
        message.reply(`You do not have access to this command, To gain acces to this command you must be a **BOT MOD*.`);
        return;
    }

    if (djTF == true) {
        if (command == (prefix + 'play')) {
            Music.execute(message, noncommand);
            return;
        }
        else if (command == (prefix + 'skip')) {
            Music.skip(message);
            return;
        }
        else if (command == (prefix + 'stop')) {
            Music.stop(message);
            return;
        }
        else if (command == (prefix + 'pause')) {
            Music.pause(message);
            return;
        }
        else if (command == (prefix + 'resume')) {
            Music.resume(message);
            return;
        }
    }

    if (modTF == true) {
        if (command == (prefix + 'volume')) {
            Music.volume(message, userInput[1]);
            return;
        }
    }

    if (command == (prefix + 'nowplaying')) {
        Music.nowPlaying(message);
        return;
    }
    else if (command == (prefix + 'showqueue')) {
        Music.showQueue(message);
        return;
    }
    //#endregion

    //#region prefix Command
    if((command === (prefix + 'changeprefix')) && (adminTF == true)) {
        
        var isSymbol = /[`~!$%^&*()_+-={}[\]\|\\:";'<>?,.\/]/;

        if(userInput[1] != undefined) {
            if ((userInput[1].length == 1) && (isSymbol.test(userInput[1]))){
                prefixChange(userInput[1], serverid);

                const embMsg = new Discord.RichEmbed()
                    .setTitle('Current Prefix:')
                    .setColor(32768)
                    .setDescription('Current Prefix is ' + userInput[1]);
                message.channel.send(embMsg);
                message.delete().catch(O_o=>{})
                return;
            }
            else {
                const embMsg = new Discord.RichEmbed()
                    .setTitle('Error!')
                    .setColor(0xb50000)
                    .setDescription('Bot Prefix Must be one of the following: ````~!$%^&*()_+-={}[]|\:";\'<>?,./```');
                message.channel.send(embMsg);
                message.delete().catch(O_o=>{})
                return;
            }
        }
        else {
            const embMsg = new Discord.RichEmbed()
                .setTitle('Error!')
                .setColor(0xb50000)
                .setDescription('You must define a bot prefix.');
            message.channel.send(embMsg);
            message.delete().catch(O_o=>{})
            return;
        }
    }
    else if((command === (prefix + 'changeprefix')) && (adminTF === false)) {
        const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You lack the required permissions to change the prefix!');
        message.channel.send(embMsg);
        message.delete().catch(O_o=>{})
        return;
    }
    else if (command === 'prefix') {
        const embMsg = new Discord.RichEmbed()
            .setTitle('Current Prefix:')
            .setColor(32768)
            .setDescription('Current Prefix is ' + prefix);
        message.channel.send(embMsg);
        message.delete().catch(O_o=>{})
        return;
    }
    //#endregion

    //#region iss command
    else if (command == (prefix + 'iss')) {
        ISS.iss(message);
    }
    //#endregion

    //#region agify command
    else if (command == (prefix + 'agify')) {
        Agify.agify(message);
    }
    //#endregion

    //#region d2 commands
    else if (command == (prefix + 'd2')) {
        if (userInput[1] == "status") {
            Destiny2Commands.getStatus(message, message.content.toLowerCase().substring(11));
        }
        else if (userInput[1] == "clan") {
            Destiny2Commands.getClan(message, message.content.toLowerCase().substring(9));
        }
        return;
    }
    //#endregion

    //#region help Command
    if(command === (prefix + 'help')) {
        var txt = "";
        if (userInput[1] == 'help') {
            for (key in cmdObj.help) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.help[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.help[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'music') {
            for (key in cmdObj.music) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.music[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.music[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'admin') {
            for (key in cmdObj.admin) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.admin[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.admin[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'fun') {
            for (key in cmdObj.fun) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.fun[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.fun[key] + '\n';
                }
            }
        }
        else if (userInput[1] == 'gaming') {
            for (key in cmdObj.gaming) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.gaming[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.gaming[key] + '\n';
                }
            }
        }
        else {
            for (key in cmdObj.help) {
                if (key != "prefix"){
                    txt += prefix + key + ' - ' + cmdObj.help[key] + '\n';
                }
                else {
                    txt += key + ' - ' + cmdObj.help[key] + '\n';
                }
            }
        }
        
        const embMsg = new Discord.RichEmbed()
            .setTitle('Help')
            .setColor(0xb50000)
            .setDescription(txt);
        message.channel.send(embMsg);
        message.delete().catch(O_o=>{});
        return;
    }
    //#endregion

    //#region Chat Clear
    if((command === (prefix + 'clear')) && (adminTF == true)) {
        Clear.clearMessages(message);
    }
    //#endregion
    
    //#region quote command
    else if (command == (prefix + 'quote')) {
        // Get a random index (random quote) from list of quotes in quotes.json
        Quote.getRandomQuote(message);
    }
    //#endregion

    //#region torture command
    else if (command == (prefix + 'torture') && (adminTF === true)) {
        // Call Torture helper function
        message.mentions.members.forEach((member) => {
            Torture.torture(message, member);
        });
        return;
    }
    //#endregion
});
//#endregion

//#region Prefix Changing
function prefixChange(newPrefix, serverid) {
    prefixFile[serverid] = {"prefix": newPrefix};

    fs.writeFile("./botprefix.json", JSON.stringify(prefixFile), (err) => {
        if (err) {
            console.error(err);
            return;
        };
    });
}
//#endregion

//#region Set An Interval that only runs x times function (setIntervalTimes)
function setIntervalTimes(callback, delay, repetitions) {
    var x = 0;
    var intervalID = setInterval(function () {
        
        callback();

        if (++x === repetitions) {
            clearInterval(intervalID);
        }
    }, delay);
}
//#endregion

//#region Refresh User Account Info
function refreshUser() {
    userAccountInfo = JSON.parse(fs.readFileSync('./userinfo.json'));
}
//#endregion

//#region Autorole Listener
    //#region Redable constants
    // This makes the events used a bit more readable
    const events = {
	    MESSAGE_REACTION_ADD: 'messageReactionAdd',
	    MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    };
    //#endregion

    //#region This event handles adding/removing users from the role(s) they chose based on message reactions
    client.on('raw', async event => {
        if (!events.hasOwnProperty(event.t)) return;

        const { d: data } = event;
        const user = client.users.get(data.user_id);
        const channel = client.channels.get(data.channel_id);

        const message = await channel.fetchMessage(data.message_id);
        const member = message.guild.members.get(user.id);
        var serverid = message.channel.guild.id;

        const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
        let reaction = message.reactions.get(emojiKey);

        if (!reaction) {
            // Create an object that can be passed through the event like normal
            const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
            reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
        }

        let embedFooterText;
        if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

        if (
            (message.author.id === client.user.id) && (message.content !== config[serverid].autorole.initialMessage || 
            (message.embeds[0] && (embedFooterText !== config[serverid].autorole.embedFooter)))
        ) {

            if ((message.embeds.length >= 1)) {
                const fields = message.embeds[0].fields;

                for (const { name, value } of fields) {
                    if (member.id !== client.user.id) {
                        const guildRole = message.guild.roles.find(r => r.name === value);
                        if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                            if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                            else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                        }
                    }
                }
            }
        }
    });
    //#endregion

    //#region This handels unhandeled rejections
    process.on('unhandledRejection', err => {
        const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	    console.error("Unhandled Rejection", msg);
    });
    //#endregion
//#endregion