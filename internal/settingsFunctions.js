//#region Dependencies
const { Message } = require('discord.js');
const { writeFileSync } = require('fs');
//#endregion

//#region Helpers
const { updateConfigFile } = require('../helpers/currentSettings.js');
const { embedCustom } = require('../helpers/embedMessages.js');
//#endregion

//Refreshing the serverConfig from serverConfig.json
var serverConfig = updateConfigFile();

//Defining a filter for the setup commands to ignore bot messages
const msgFilter = (m) => !m.author.bot;

//#region Function that sets modMail settings
/**
 * This function runs the setup for the ModMail feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
async function setModMail(message) {
    var serverID = message.guild.id;
    var modList = [];

    message.channel.send('Please respond with `T` if you would like to enable DMing to bot to DM mods, respond with `F` if you do not.');
    
    try {
        var enableIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
        var enableTXT = enableIn.first().content.toLowerCase();
        var enable = undefined;
        if (enableTXT == 't') {
            enable = true,

            message.channel.send('Please @ the people you want to receive mod mail.')
    
            try {
                var roleIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                roleIn.first().mentions.members.forEach((member) => {
                    modList.push(member.id);
                });
            }
            catch (err) {
                return message.channel.send('Timeout Occurred. Process Terminated.');
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occurred. Process Terminated.');
    }

    if (modList == undefined) {
        modList = [];
    }
    if (enable == undefined) {
        enable = false;
    }

    modMail = {};
    modMail.enable = enable;
    modMail.modList = modList;

    serverConfig[serverID].modMail = modMail;

    await buildConfigFile(serverConfig);

    message.channel.send("Mod Mail Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region Function that sets autoRole settings
/**
 * This function runs the setup for the AutoRole feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
async function setAutoRole(message) {
    var serverID = message.guild.id;
    message.channel.send('Example Message:');
    await embedCustom(message, "Role Message", "#FFFF00", "**React to the messages below to receive the associated role.**", { text: `If you do not receive the role try reacting again.`, iconURL: null }, null,[],null,null);

    message.channel.send('Please respond with `T` if you would like to enable react to receive role feature, respond with `F` if you do not.');
    
    try {
        var enableIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
        var enableTXT = enableIn.first().content.toLowerCase();
        var enable = undefined;
        if (enableTXT == 't') {
            enable = true;
    
            message.channel.send('Please respond with the text you would like the reactRole message to contain. Replaces (`**React to the messages below to receive the associated role.**`) in the example. You have two minutes to respond to each setting.');

            try {
                var embedMessageIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                var embedMessage = embedMessageIn.first().content;
            }
            catch (err) {
                console.log(err.message);
                return message.channel.send('Timeout Occurred. Process Terminated.')
            }
        
            var embedFooter = 'If you do not receive the role try reacting again.';
        
            message.channel.send('Please @ the roles you would like users to be able to assign to themselves.');
        
            try {
                var embedRoleIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                var roles = [];
                embedRoleIn.first().mentions.roles.forEach( role => roles.push(role.name));
            }
            catch (err) {
                console.log(err.message);
                return message.channel.send('Timeout Occurred. Process Terminated.')
            }
            message.channel.send('Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces separating the reactions, like this: `🐕 🎩 👾`. (NOTE: You can use custom reactions as long as they are not animated and belong to this server)')
        
            try {
                var embedReactIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                var reactions = embedReactIn.first().content.split(' ');
            }
            catch (err) {
                console.log(err.message);
                return message.channel.send('Timeout Occurred. Process Terminated.')
            }
        }
    }
    catch (err) {
        console.log(err.message);
        return message.channel.send('Timeout Occurred. Process Terminated.')
    }

    if (embedMessage == undefined) {
        embedMessage = "`React to the emoji that matches the role you wish to receive.\nIf you would like to remove the role, simply remove your reaction!\n`";
    }
    if (embedFooter == undefined) {
        embedFooter = "If you do not receive the role try reacting again.";
    }
    if (roles == undefined) {
        roles = [];
    }
    if (reactions == undefined) {
        reactions = [];
    }
    if (enable == undefined) {
        enable = false;
    }

    autoRole = {};
    autoRole.enable = enable;
    autoRole.embedMessage = embedMessage;
    autoRole.embedFooter = embedFooter;
    autoRole.roles = roles;
    autoRole.reactions = reactions;
    
    serverConfig[serverID].autoRole = autoRole;

    await buildConfigFile(serverConfig);

    message.channel.send("Auto Role Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region Function that sets joinRole settings
/**
 * This function runs the setup for the JoinRole feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
async function setJoinRole(message) {
    var serverID = message.guild.id;

    message.channel.send('Please respond with `T` if you would like to enable assign a user a role on server join, respond with `F` if you do not.');
    
    try {
        var enableIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
        var enableTXT = enableIn.first().content.toLowerCase();
        var enable = undefined;
        if (enableTXT == 't') {
            enable = true,

            message.channel.send('Please @ the role you would like to assign users when they join your server.')
    
            try {
                var roleIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                var role = roleIn.first().mentions.roles.first().name;
                console.log(role);
            }
            catch (err) {
                return message.channel.send('Timeout Occurred. Process Terminated.')
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occurred. Process Terminated.')
    }

    if (role == undefined) {
        role = "";
    }
    if (enable == undefined) {
        enable = false;
    }

    joinRole = {};
    joinRole.enabled = enable;
    joinRole.role = role;

    serverConfig[serverID].joinRole = joinRole;

    await buildConfigFile(serverConfig);

    message.channel.send("Join Role Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region Function that sets music settings
/**
 * This function runs the setup for the Music feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
async function setMusic(message) {
    var serverID = message.guild.id;

    message.channel.send('Please respond with `T` if you would like to enable music functionality, respond with `F` if you do not.');
    
    try {
        var enableIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
        var enableTXT = enableIn.first().content.toLowerCase();
        var enable = undefined;
        if (enableTXT == 't') {
            enable = true;
            
            message.channel.send('Please @ the role you would like to use as a DJ role.');
    
            try {
                var djRoleIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                var djRoles = djRoleIn.first().mentions.roles.first().name;
                console.log(djRoles);
            }
            catch (err) {
                return message.channel.send('Timeout Occurred. Process Terminated.')
            }
        
            message.channel.send('Please link the text channel you would like the music commands to be used in. \`You can do that by typing "#" followed by the channel name.\`')
        
            try {
                var musicTXTIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
                var textChannel = message.guild.channels.cache.get(musicTXTIn.first().content.substring(2, musicTXTIn.first().content.length-1)).name;
            }
            catch (err) {
                return message.channel.send('Timeout Occurred. Process Terminated.')
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occurred. Process Terminated.')
    }

    if (djRoles == undefined) {
        djRoles = "DJ";
    }
    if (textChannel == undefined) {
        textChannel = "Music";
    }
    if (enable == undefined) {
        enable = false;
    }

    music = {};
    music.enable = enable;
    music.djRoles = djRoles;
    music.textChannel = textChannel;

    serverConfig[serverID].music = music;

    await buildConfigFile(serverConfig);

    message.channel.send("Music Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region Function that sets general settings
/**
 * This function runs the setup for the general features.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
async function setGeneral(message) {
    var serverID = message.guild.id;

    message.channel.send('Please @ the roles you would like to use as Bot Admins.');
    
    try {
        var adminRolesIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
        var adminRoles = [];
        adminRolesIn.first().mentions.roles.forEach (role => adminRoles.push(role.name));
    }
    catch (err) {
        return message.channel.send('Timeout Occurred. Process Terminated.')
    }

    message.channel.send('Please @ the roles you would like to use as Bot Mods. These automatically include you admin roles, if you wish to add none, simply reply `None`.');

    try {
        var modRolesIn = await message.channel.awaitMessages({ filter: msgFilter, max: 1, time: 120000, errors: ['time'] });
        var modRoles = adminRoles.map((x) => x);
        if (modRolesIn.first().content.toLowerCase() == 'none') {
            var modRoles = adminRoles.map((x) => x);
        }
        else {
            modRolesIn.first().mentions.roles.forEach (role => modRoles.push(role.name));
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occurred. Process Terminated.')
    }

    if (adminRoles == undefined) {
        adminRoles = [];
    }
    if (modRoles == undefined) {
        modRoles = adminRoles.map((x) => x);
    }

    general = {};
    general.adminRoles = adminRoles;
    general.modRoles = modRoles;

    serverConfig[serverID].general = general;

    await buildConfigFile(serverConfig);

    message.channel.send("General Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region Function that runs all setup commands
/**
 * This function runs the setup for all features.
 * @param {Message} message - Discord.js Message Object
 * @returns {void} Void
 */
async function setup(message) {
    var serverID = message.guild.id;

    //Sets up all commands
    await setAutoRole(message);
    await setGeneral(message);
    await setJoinRole(message);
    await setMusic(message);
    await setModMail(message);

    //Removes the Setup Needed Tag
    serverConfig[serverID].setupNeeded = false;
    await buildConfigFile(serverConfig);
    embedCustom(message, "Server Setup Complete", "#5D3FD3", "**MAKE SURE TO PUT THE ROLE FOR THIS BOT ABOVE ROLES YOU WANT THE BOT TO MANAGE, if you don\'t the bot will not work properly!**", { text: `Requested by ${message.author.tag}`, iconURL: null }, null,[],null,null);
    updateConfigFile();
    return;
}
//#endregion

//#region Function that builds config file
/**
 * This function builds the serverConfig.json file with the provided JSON.
 * @param {string} config - String of JSON
 */
async function buildConfigFile(config) {
    await writeFileSync('./data/serverConfig.json', JSON.stringify(config), function(err) {
        if (err) {
            console.log(err);
        }
    });

    await updateConfigFile();
}
//#endregion

//#region Function that adds the provided server to the serverConfig.json file
/**
 * This function adds the provided server to the serverConfig.json file.
 * @param {number} serverID - Server ID for server to be added
 */
function addServerConfig(serverID) {
    if (serverConfig[serverID] == undefined) {
        serverConfig[serverID] = {"setupNeeded":true,"autoRole":{"enable":false,"embedMessage":"Not Set Up","embedFooter":"Not Set Up","roles":["Not Set Up"],"reactions":["🎵"]},"joinRole":{"enable":false,"role":"Not Set Up"},"music":{"enable":false,"djRoles":["Not Set Up"],"textChannel":"not-set-up"},"general":{"adminRoles":["Not Set Up"],"modRoles":["Not Set Up"]},"modMail":{"enable":false,"modList":[]}};
    }

    buildConfigFile(serverConfig);
}
//#endregion

//#region Function that removes the provided server form the serverConfig.json file
/**
 * This function removes the provided server from the serverConfig.json file
 * @param {number} serverID - Server ID for server to be added
 */
function removeServerConfig(serverID) {
    if (serverConfig[serverID] !== undefined) {
        serverConfig[serverID] = undefined;
    }

    buildConfigFile(serverConfig);
}
//#endregion

//#region exports
module.exports = { setAutoRole, setJoinRole, setMusic, setGeneral, setup, setModMail, buildConfigFile, removeServerConfig, addServerConfig };
//#endregion