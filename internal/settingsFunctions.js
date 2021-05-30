//#region Dependancies
const { MessageEmbed } = require('discord.js');
const { writeFileSync, readFileSync } = require('fs');
const { updateConfigFile } = require('../helpers/currentsettings.js');
var serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
//#endregion

//#region modmail settings
async function setModMail(message) {
    var serverID = message.channel.guild.id;
    var modlist = [];

    message.channel.send('Please respond with `T` if you would like to enable DMing to bot to DM mods, respond with `F` if you do not.');
    
    try {
        var enablein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var enabletxt = enablein.first().content.toLowerCase();
        var enable = undefined;
        if (enabletxt == 't') {
            enable = true,

            message.channel.send('Please @ the people you want to recieve mod mail.')
    
            try {
                var rolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                rolein.first().mentions.members.forEach((member) => {
                    modlist.push(member.id);
                });
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    if (modlist == undefined) {
        modlist = [];
    }
    if (enable == undefined) {
        enable = false;
    }

    modmail = {};
    modmail.enable = enable;
    modmail.modlist = modlist;

    serverConfig[serverID].modmail = modmail;

    await bulidConfigFile(serverConfig);

    message.channel.send("Mod Mail Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region autorole settings
async function setAutorole(message) {
    var serverID = message.channel.guild.id;
    var embMsg = new MessageEmbed()
        .setTitle('Role Message')
        .setColor(16776960)
        .setDescription('**React to the messages below to receive the associated role.**')
        .setFooter('If you do not recieve the role try reacting again.');
    message.channel.send('Example Message:');
    await message.channel.send(embMsg);

    message.channel.send('Please respond with `T` if you would like to enable react to recieve role module, respond with `F` if you do not.');
    
    try {
        var enablein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var enabletxt = enablein.first().content.toLowerCase();
        var enable = undefined;
        if (enabletxt == 't') {
            enable = true;
    
            message.channel.send('Please respond with the text you would like the reactrole message to contain. Replaces (`**React to the messages below to receive the associated role.**`) in the example. You have two minutes to respond to each setting.');

            try {
                var embmsgin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var embedMessage = embmsgin.first().content;
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        
            var embedFooter = 'If you do not recieve the role try reacting again.';
        
            message.channel.send('Please @ the roles you would like users to be able to assign to themselves.')
        
            try {
                var embrolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var roles = [];
                embrolein.first().content.split(' ').forEach (role => roles.push(message.guild.roles.cache.get(role.substring(3, role.length-1)).name));
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        
            message.channel.send('Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces seperating the reactions, like this: `🐕 🎩 👾`. (NOTE: You can use custome reactions as long as they are not animated and belong to this server)')
        
            try {
                var embreactin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var reactions = embreactin.first().content.split(' ');
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    if (embedMessage == undefined) {
        embedMessage = "`React to the emoji that matches the role you wish to receive.\nIf you would like to remove the role, simply remove your reaction!\n`";
    }
    if (embedFooter == undefined) {
        embedFooter = "If you do not recieve the role try reacting again.";
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

    autorole = {};
    autorole.enable = enable;
    autorole.embedMessage = embedMessage;
    autorole.embedFooter = embedFooter;
    autorole.roles = roles;
    autorole.reactions = reactions;
    
    serverConfig[serverID].autorole = autorole;

    await bulidConfigFile(serverConfig);

    message.channel.send("Auto Role Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region join role settings
async function setJoinrole(message) {
    var serverID = message.channel.guild.id;

    message.channel.send('Please respond with `T` if you would like to enable assigin a user a role on server join, respond with `F` if you do not.');
    
    try {
        var enablein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var enabletxt = enablein.first().content.toLowerCase();
        var enable = undefined;
        if (enabletxt == 't') {
            enable = true,

            message.channel.send('Please @ the role you would like to assign users when they join your server.')
    
            try {
                var rolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var role = message.guild.roles.cache.get(rolein.first().content.substring(3, rolein.first().content.length-1)).name;
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    if (role == undefined) {
        role = "";
    }
    if (enable == undefined) {
        enable = false;
    }

    joinrole = {};
    joinrole.enabled = enable;
    joinrole.role = role;

    serverConfig[serverID].joinrole = joinrole;

    await bulidConfigFile(serverConfig);

    message.channel.send("Join Role Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region music settings
async function setMusic(message) {
    var serverID = message.channel.guild.id;

    message.channel.send('Please respond with `T` if you would like to enable music functionality, respond with `F` if you do not.');
    
    try {
        var enablein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var enabletxt = enablein.first().content.toLowerCase();
        var enable = undefined;
        if (enabletxt == 't') {
            enable = true;
            
            message.channel.send('Please @ the role you would like to use as a DJ role.');
    
            try {
                var djrolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var djRoles = message.guild.roles.cache.get(djrolein.first().content.substring(3, djrolein.first().content.length-1)).name;
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        
            message.channel.send('Please link the text channel you would like the music commands to be used in. \`You can do that by typing "#" followed by the channel name.\`')
        
            try {
                var musictxtin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var textChannel = message.guild.channels.cache.get(musictxtin.first().content.substring(2, musictxtin.first().content.length-1)).name;
            }
            catch (err) {
                return message.channel.send('Timeout Occured. Process Terminated.')
            }
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
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

    await bulidConfigFile(serverConfig);

    message.channel.send("Music Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region general settings
async function setGeneral(message) {
    var serverID = message.channel.guild.id;

    message.channel.send('Please @ the roles you would like to use as Bot Admins.');
    
    try {
        var adminrolesin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var adminRoles = [];
        adminrolesin.first().content.split(' ').forEach (role => adminRoles.push(message.guild.roles.cache.get(role.substring(3, role.length-1)).name));
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    message.channel.send('Please @ the roles you would like to use as Bot Mods. These automaticaly include you admin roles, if you wish to add none, simply reply `None`.');

    try {
        var modrolesin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var modRoles = adminRoles.map((x) => x);
        if (modrolesin.first().content.toLowerCase() == 'none') {
            var modRoles = adminRoles.map((x) => x);
        }
        else {
            modrolesin.first().content.split(' ').forEach (role => modRoles.push(message.guild.roles.cache.get(role.substring(3, role.length-1)).name));
        }
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
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

    await bulidConfigFile(serverConfig);

    message.channel.send("General Setup Complete!");

    config = updateConfigFile();
    return config;
}
//#endregion

//#region setup command
async function setup(message) {
    var serverID = message.channel.guild.id;

    //Sets up all commands
    await setAutorole(message);
    await setGeneral(message);
    await setJoinrole(message);
    await setMusic(message);
    await setModMail(message);

    //Removes the Setup Needed Tag
    serverConfig[serverID].setupneeded = false;
    await bulidConfigFile(serverConfig);
    message.channel.send('Server Setup Complete, \`MAKE SURE TO PUT THE ROLE FOR THIS BOT ABOVE ROLES YOU WANT THE BOT TO MANAGE, if you don\'t the bot will not work properly!\`');
    updateConfigFile();
    return;
}
//#endregion

//#region bulid configfile
async function bulidConfigFile(config) {
    await writeFileSync('./data/serverconfig.json', JSON.stringify(config), function(err) {
        if (err) {
            console.log(err);
        }
    });

    await updateConfigFile();
}
//#endregion

//#region add server to configfile
function addServerConfig(serverID) {
    if (serverConfig[serverID] == undefined) {
        serverConfig[serverID] = {"setupneeded":true,"autorole":{"enable":false,"embedMessage":"Not Set Up","embedFooter":"Not Set Up","roles":["Not Set Up"],"reactions":["🎵"]},"joinrole":{"enable":false,"role":"Not Set Up"},"music":{"enable":false,"djRoles":["Not Set Up"],"textChannel":"not-set-up"},"general":{"adminRoles":["Not Set Up"],"modRoles":["Not Set Up"]},"modmail":{"enable":false,"modlist":[]}};
    }

    bulidConfigFile(serverConfig);
}
//#endregion

//#region remove server from configfile
function removeServerConfig(serverID) {
    if (serverConfig[serverID] !== undefined) {
        serverConfig[serverID] = undefined;
    }

    bulidConfigFile(serverConfig);
}
//#endregion

//#region exports
module.exports = { setAutorole, setJoinrole, setMusic, setGeneral, setup, setModMail, bulidConfigFile, removeServerConfig, addServerConfig };
//#endregion