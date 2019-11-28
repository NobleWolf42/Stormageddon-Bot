//#region Dependency

var Discord = require('discord.js');
var fs = require("fs");
var config = require('./config.json');
var prefixFile = require('./botprefix.json');
var cmdObj = require('./commands.json');
var prefix = prefixFile.prefix;
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
    client.user.setPresence({ game: { name: `Use ${prefix}help to show commands` } });
});

//Logs Errors
client.on('error', console.error);

//#endregion

//#region Server Rolls

//Function that calls the server roles
function serverRoleUpdate(sRole) {
    
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops throught the Admin Role Names, pusing them to an array
    for (key in config.general.adminRoles) {
        
        //Pushes role IDs to Admin if they Match config.general.adminRoles
        if (basicServerRoles[config.general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[config.general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pusing them to an array
    for (key in config.general.modRoles) {
        
        //Pushes role IDs to Mods if they Match config.general.modRoles
        if (basicServerRoles[config.general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[config.general.modRoles[key]]);
        }
    }
}

//#endregion

//#region Admin / Mod Check

//Function that returns boolean for if the user who sent the message is an Admin (based off config.connection.adminRoles)
function adminCheck(userRolesArray, serverRolesArray) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray);
    
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

//Function that returns boolean for if the user who sent the message is a Moderator (based off config.connection.modRoles)
function modCheck(userRolesArray, serverRolesArray) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray);
    
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
    var userInput = message.content.toLowerCase().split(' ');
    var command = userInput[0];
    var userRoles = message.author.lastMessage.member._roles;
    var serverRoles = message.channel.guild.roles;
    var adminTF = adminCheck(userRoles, serverRoles);
    var modTF = modCheck(userRoles, serverRoles);

    //Runs AutoRole Message Generation
    if ((command === (prefix + config.autorole.setupCMD) && (adminTF === true))){
        sendRoleMessage(message);
    };

    //#region prefix command
    if((command === (prefix + 'prefix')) && (adminTF === true)) {
        
        prefixChange(userInput[1]);
        const embMsg = new Discord.RichEmbed()
            .setTitle('Current Prefix:')
            .setColor(32768)
            .setDescription('Current Prefix is ' + prefix);
        message.channel.send(embMsg);
    }
    else if((command === (prefix + 'prefix')) && (adminTF === false)) {
        const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription('You lack the required permissions to change the prefix!');
        message.channel.send(embMsg);
    }
    //#endregion

    //#region for all @ commands
    //@magma
    if(message.mentions.users.first() !== undefined) {
        console.log(message.mentions.users.first());
        if(message.mentions.users.first().id === '211865015592943616') {
            const attachment = new Discord.Attachment('https://i.ytimg.com/vi/EKxio8HZiNA/maxresdefault.jpg');
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
            txt += prefix + key + ' - ' + cmdObj.key + '/n';
        }
        
        const embMsg = new Discord.RichEmbed()
        .setTitle('Error!')
        .setColor(0xb50000)
        .setDescription(txt);
        message.channel.send(embMsg);
    }
    //#endregion
});

//#endregion

//#region Prefix Changing

function prefixChange(newPrefix) {
    prefix = newPrefix;
    prefixFile.prefix = newPrefix;

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

//#region Autoroll

//Checks to make sure your roles and reactions match up
if (config.autorole.roles.length !== config.autorole.reactions.length) {
    throw new Error("Roles list and reactions list are not the same length! Please double check this in the config.js file");
}

//Function that will create messages to allow you to assign yourself a role
function generateMessages() {
    return config.autorole.roles.map((r, e) => {
        return {
            role: r,
            message: `React below to get the **"${r}"** role!`, //DONT CHANGE THIS,
            emoji: config.autorole.reactions[e]
        };
    });
}

//Function that generates embed feilds if config.autorole.embed is set to true
function generateEmbedFields() {
    return config.autorole.roles.map((r, e) => {
        return {
            emoji: config.autorole.reactions[e],
            role: r
        };
    });
}

// Handles the creation of the role reactions. Will either send the role messages separately or in an embed, depending on your settings in config.json
function sendRoleMessage(message) {

    // We don't want the bot to do anything further if it can't send messages in the channel
    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;
    
    if (config.autorole.deleteSetupCMD) {
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

    if (!config.autorole.embed) {
        if (!config.autorole.initialMessage || (config.autorole.initialMessage === '')) 
            throw "The 'initialMessage' property is not set in the config.js file. Please do this!";

        message.channel.send(config.autorole.initialMessage);

        const messages = generateMessages();
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
        if (!config.autorole.embedMessage || (config.autorole.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config.js file. Please do this!";
        if (!config.autorole.embedFooter || (config.autorole.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config.js file. Please do this!";

        const roleEmbed = new Discord.RichEmbed()
            .setDescription(config.autorole.embedMessage)
            .setFooter(config.autorole.embedFooter);

        if (config.autorole.embedColor) roleEmbed.setColor(config.autorole.embedColor);

        if (config.autorole.embedThumbnail && (config.autorole.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(config.autorole.embedThumbnailLink);
        else if (config.autorole.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields();
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of config.autorole.reactions) {
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
        (message.author.id === client.user.id) && (message.content !== config.autorole.initialMessage || 
        (message.embeds[0] && (embedFooterText !== config.autorole.embedFooter)))
    ) {

        if (!config.autorole.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (config.autorole.embed && (message.embeds.length >= 1)) {
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