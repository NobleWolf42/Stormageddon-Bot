//#region Dependency

var Discord = require('discord.js');
var ytdl = require('ytdl-core');
var fs = require("fs");
var config = require('./config.json');
var prefixFile = require('./botprefix.json');
var cmdObj = require('./commands.json');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var doggoLinks = [];
var adminRoleIDs = [];
var modRoleIDs = [];

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
    console.log(`Logged in as ${client.user.tag}!`)
    getDoggoPics();
    client.user.setPresence({ game: { name: `Use !help to show commands` } });
});

//Logs Errors
client.on('error', console.error);

//#endregion

//#region Server Rolls

//Function that calls the server roles
function serverRoleUpdate(sRole, serverid) {
    
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops throught the Admin Role Names, pusing them to an array
    for (key in config[serverid].general.adminRoles) {
        
        //Pushes role IDs to Admin if they Match config[serverid].general.adminRoles
        if (basicServerRoles[config[serverid].general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[config[serverid].general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pusing them to an array
    for (key in config[serverid].general.modRoles) {
        
        //Pushes role IDs to Mods if they Match config[serverid].general.modRoles
        if (basicServerRoles[config[serverid].general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[config[serverid].general.modRoles[key]]);
        }
    }
}

//#endregion

//#region Admin / Mod Check

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

//#endregion

//#region Message Handeling

//Handels Messages and their responses
client.on("message", message => {

    //#region Permission Checks
    // Make sure bots can't run this command
    if (message.author.bot) return;

    // Make sure the command can only be run in a server
    if (!message.guild) return;
    //#endregion

    //Varibles for the message info needed
    var serverid = message.channel.guild.id;
    var userInput = message.content.toLowerCase().split(' ');
    var command = userInput[0];
    var userRoles = message.author.lastMessage.member._roles;
    var serverRoles = message.channel.guild.roles;
    var adminTF = adminCheck(userRoles, serverRoles, serverid);
    var modTF = modCheck(userRoles, serverRoles, serverid);
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

    //Runs AutoRole Message Generation
    if ((command === (prefix + 'createautorolemsg') && (adminTF === true))){
        sendRoleMessage(message, serverid);
    };

    //#region prefix command
    if((command === (prefix + 'changeprefix')) && (adminTF == true)) {
        
        var isSymbol = /[`~!$%^&*()_+-={}[\]\|\\:";'<>?,.\/]/;

        if(userInput[1] != undefined) {
            if ((userInput[1].length = 1) && (isSymbol.test(userInput[1]))){
                prefixChange(userInput[1], serverid);

                const embMsg = new Discord.RichEmbed()
                    .setTitle('Current Prefix:')
                    .setColor(32768)
                    .setDescription('Current Prefix is ' + userInput[1]);
                message.channel.send(embMsg);
            }
            else {
                const embMsg = new Discord.RichEmbed()
                    .setTitle('Error!')
                    .setColor(0xb50000)
                    .setDescription('Bot Prefix Must be one of the following: ````~!$%^&*()_+-={}[]|\:";\'<>?,./```');
                message.channel.send(embMsg);
            }
        }
        else {
            const embMsg = new Discord.RichEmbed()
                .setTitle('Error!')
                .setColor(0xb50000)
                .setDescription('You must define a bot prefix.');
            message.channel.send(embMsg);
        }

    }
    else if((command === (prefix + 'changeprefix')) && (adminTF === false)) {
        const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You lack the required permissions to change the prefix!');
        message.channel.send(embMsg);
    }
    else if (command === 'prefix') {
        const embMsg = new Discord.RichEmbed()
            .setTitle('Current Prefix:')
            .setColor(32768)
            .setDescription('Current Prefix is ' + prefix);
        message.channel.send(embMsg);
    }
    //#endregion

    //#region for all @ commands
    if(message.mentions.users.first() !== undefined) {

        //@magma
        if(message.mentions.users.first().id === '211865015592943616') {
            const attachment = new Discord.Attachment('https://cdn.discordapp.com/attachments/254389303294165003/649734083366223895/kji50lq4nhq11.png');
            message.channel.send('Nep Nep Nep Nep Nep Nep Nep');
            message.channel.send(attachment);
        }

        //@storm
        if(message.mentions.users.first().id === '645141555719569439') {
            var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);
            message.channel.send('Woof Woof');
            message.channel.send(attachment);
        }
    }
    //#endregion

    //#region iss command
    if (command == (prefix + 'iss')) {
        var request = new XMLHttpRequest()
        request.open('GET', 'http://api.open-notify.org/astros.json', true)
        request.onload = function() {
           // Begin accessing JSON data here
           var data = JSON.parse(request.responseText)
    
           if (request.status >= 200 && request.status < 400) {
             var response = "\n [Astronaut Information]";

             Array.from(data.people).forEach(function(people){
               response += "\n " + people.name + " : " + people.craft;
             })
             
              message.reply(response);
          } else {
             console.log('error');
             message.reply("The ISS API was unable to be reached at this time. \n Try again later.");
          }
        }

        request.send()
    }
    //#endregion

    //#region agify command
    if (command == (prefix + 'agify')) {
        var request = new XMLHttpRequest()
        request.open('GET', 'https://api.agify.io/?name='+userInput[1], true)
        request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)
    
            if (request.status >= 200 && request.status < 400) {
                // Capitalizing the first lettter of the returned name
                var capitalizedname = userInput[1].charAt(0).toUpperCase() + userInput[1].slice(1);

                message.reply("\n The age of " + capitalizedname + " is estimated at " + data.age + ".");
            } else {
                console.log('error');
                message.reply("The Agify API was unable to be reached at this time. \n Try again later.");
            }
        }

        request.send()
    }
    //#endregion

    //#region d2 commands
    if (command == (prefix + 'd2')) {
        if (userInput[1] == "status") {
            var pers_name = message.content.toLowerCase().substring(11);
            var request = new XMLHttpRequest()
            request.open('GET', 'https://www.bungie.net/Platform//User/SearchUsers?q='+pers_name, true);
            request.setRequestHeader('X-API-KEY', '671b3211756445cbb83b5d82f6682ebd');
            request.onload = function() {
            // Begin accessing JSON data here
            var data = JSON.parse(request.responseText)["Response"][0]
    
            if (request.status >= 200 && request.status < 400 ) {
                if (data != null) {
                message.reply("\n User was last updated at " + data["lastUpdate"] + "\n User began their journey at " + data["firstAccess"]);
                }
                else {
                    message.reply("\n The Search for a user by that name returned no results. \n Try something else.");
                }
            } else {
                message.reply("The Destiny API was unable to be reached at this time. \n Try again later.");
            }
        }

        request.send()
        }
        else if (userInput[1] == "clan") {
            var clan_name = message.content.toLowerCase().substring(9);
            var request = new XMLHttpRequest()
            request.open('GET', 'https://www.bungie.net/Platform/GroupV2/Name/'+clan_name+'/1', true);
            request.setRequestHeader('X-API-KEY', '671b3211756445cbb83b5d82f6682ebd');
            request.onload = function() {
                // Begin accessing JSON data here
                var data = JSON.parse(request.responseText)["Response"]
        
                if (request.status >= 200 && request.status < 400) {
                    if (data != null) {
                        var domain = "https://www.bungie.net/";
                        // Clan Avatar + about section
                        var attachment = new Discord.Attachment(domain + data["detail"]["avatarPath"]);
                        message.channel.send(data["detail"]["about"], attachment);
                        //Founder Profile pic + name
                        var attachment = new Discord.Attachment(domain + data["founder"]["bungieNetUserInfo"]["iconPath"]);
                        message.channel.send("The founder is " + data["founder"]["bungieNetUserInfo"]["displayName"],attachment);
                        // Clan Creation Date
                        message.reply("The clan was created on " + data["detail"]["creationDate"]);
                    }
                    else {
                        message.reply("\n The Search for a clan by that name returned no results. \n Try something else.");
                    }
                } else {
                    message.reply("The Destiny API was unable to be reached at this time. \n Try again later.");
                }
            }
    
            request.send()
        }
    }
    //#endregion

    //#region dog/storm command
    if((command === (prefix + 'dog')) || (command === (prefix + 'storm'))) {
        var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);
        message.channel.send(attachment);
    }
    //#endregion

    //#region help command
    if(command === (prefix + 'help')) {
        var txt = "";
        for (key in cmdObj) {
            if (key != "prefix"){
                txt += prefix + key + ' - ' + cmdObj[key] + '\n';
            }
            else {
                txt += key + ' - ' + cmdObj[key] + '\n';
            }
        }
        
        const embMsg = new Discord.RichEmbed()
        .setTitle('Help!')
        .setColor(0xb50000)
        .setDescription(txt);
        message.channel.send(embMsg);
    }
    //#endregion

    //#region replys to meow/mew/cat/kitty
    if((userInput.includes('meow')) || (userInput.includes('mew')) || (userInput.includes('cat')) || (userInput.includes('kitty')) || (userInput.includes('squirrel'))) {
        var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);

        message.channel.send("Bork Bork Bork Bork Bork");
        message.channel.send(attachment);

        setIntervalTimes(function () {
            var attachment = new Discord.Attachment(doggoLinks[getRandomInt(103)]);

            message.author.send("Bork Bork Bork Bork Bork");
            message.author.send(attachment);
        }, 5000, 7)
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

//#region get random int function
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
//#endregion

//#region Imgur Handeling for Storm Pics
function getDoggoPics() {
    for (key in require('./stormpics.json').data) {
        doggoLinks.push(require('./stormpics.json').data[key].link);
    }
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

//#region Autoroll

//Function that will create messages to allow you to assign yourself a role
function generateMessages(serverid) {
    return config[serverid].autorole.roles.map((r, e) => {
        return {
            role: r,
            message: `React below to get the **"${r}"** role!`, //DONT CHANGE THIS,
            emoji: config[serverid].autorole.reactions[e]
        };
    });
}

//Function that generates embed feilds if config[serverid].autorole.embed is set to true
function generateEmbedFields(serverid) {
    return config[serverid].autorole.roles.map((r, e) => {
        return {
            emoji: config[serverid].autorole.reactions[e],
            role: r
        };
    });
}

// Handles the creation of the role reactions. Will either send the role messages separately or in an embed, depending on your settings in config[serverid].json
function sendRoleMessage(message, serverid) {

    //Checks to make sure your roles and reactions match up
    if (config[serverid].autorole.roles.length !== config[serverid].autorole.reactions.length) {
        throw new Error("Roles list and reactions list are not the same length! Please double check this in the config[serverid].js file");
    }  
    
    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
    
    if (config[serverid].autorole.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
        // Here we check if the bot can actually delete messages in the channel the command is being ran in
        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("I need permission to delete your command message! Please assign the 'Manage Messages' permission to me in this channel!");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');

    // Here we check if the bot can actually add recations in the channel the command is being ran in
    if (missing.includes('ADD_REACTIONS'))
        throw new Error("I need permission to add reactions to these messages! Please assign the 'Add Reactions' permission to me in this channel!");

    if (!config[serverid].autorole.embed) {
        if (!config[serverid].autorole.initialMessage || (config[serverid].autorole.initialMessage === '')) 
            throw "The 'initialMessage' property is not set in the config[serverid].js file. Please do this!";

        message.channel.send(config[serverid].autorole.initialMessage);

        const messages = generateMessages(serverid);
        for (const { role, message: msg, emoji } of messages) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            message.channel.send(msg).then(async m => {
                const customCheck = message.guild.emojis.find(e => e.name === emoji);
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }).catch(console.error);
        }
    } else {
        if (!config[serverid].autorole.embedMessage || (config[serverid].autorole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config[serverid].js file. Please do this!";
        if (!config[serverid].autorole.embedFooter || (config[serverid].autorole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config[serverid].js file. Please do this!";

        const roleEmbed = new Discord.RichEmbed()
            .setDescription(config[serverid].autorole.embedMessage)
            .setFooter(config[serverid].autorole.embedFooter);

        if (config[serverid].autorole.embedColor) roleEmbed.setColor(config[serverid].autorole.embedColor);

        if (config[serverid].autorole.embedThumbnail && (config[serverid].autorole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config[serverid].autorole.embedThumbnailLink);
        else if (config[serverid].autorole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields(serverid);
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config[serverid].autorole.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
};

// This makes the events used a bit more readable
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

// This event handles adding/removing users from the role(s) they chose based on message reactions
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

        if (!config[serverid].autorole.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (config[serverid].autorole.embed && (message.embeds.length >= 1)) {
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

process.on('unhandledRejection', err => {
    const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	console.error("Unhandled Rejection", msg);
});

//#endregion