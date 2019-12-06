//#region Dependancies
var Discord = require('discord.js');
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('./data/serverconfig.json', 'utf8'));
//#endregion

//#region autorole settings
async function setAutorole(message) {
    var serverid = message.channel.guild.id;
    var timeout = false;
    var embMsg = new Discord.RichEmbed()
        .setTitle('Role Message')
        .setColor(16776960)
        .setDescription('**React to the messages below to receive the associated role.**')
        .setFooter('React to Recieve Role');
    message.channel.send('Example Message:');
    await message.channel.send(embMsg);
    
    message.channel.send('Please respond with the text you would like the reactrole message to contain. Replaces (`**React to the messages below to receive the associated role.**`) in the example. You have two minutes to respond to each setting.');
    
    try {
        var embmsgin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var embedMessage = embmsgin.first().content;
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    message.channel.send('Please respond with the text you would like to display for the footer. Replaces (`React to Recieve Role`) in example message.')
    
    try {
        var embfootin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var embedFooter = embfootin.first().content;
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    message.channel.send('Please respond to this message with the list of roles you would like users to be able to assign to themselves. Format the list with comma, followed by a space (`, `) seperating the roles, like this: `role 1, Role 2, Role 3`.')

    try {
        var embrolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var roles = embrolein.first().content.split(', ');
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    message.channel.send('Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces seperating the reactions, like this: `🐕 🎩 👾`.')

    try {
        var embreactin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var reactions = embreactin.first().content.split(' ');
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    if (embedMessage == undefined) {
        embedMessage = "`React to the emoji that matches the role you wish to receive.\nIf you would like to remove the role, simply remove your reaction!\n`";
    }
    if (embedFooter == undefined) {
        embedFooter = "Role Reactions";
    }
    if (roles == undefined) {
        roles = [];
    }
    if (reactions == undefined) {
        reactions = [];
    }

    autorole = {};
    autorole.embedMessage = embedMessage;
    autorole.embedFooter = embedFooter;
    autorole.roles = roles;
    autorole.reactions = reactions;
    
    cfg[serverid].autorole = autorole;

    await bulidConfigFile();

    message.channel.send("Auto Role Setup Complete!");
}
//#endregion

//#region join role settings
async function setJoinrole(message) {
    var serverid = message.channel.guild.id;

    message.channel.send('Please respond with `T` if you would like to enable assigin a user a role on server join, respond with `F` if you do not.');
    
    try {
        var enablein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var enabletxt = enablein.first().content.toLowerCase();
        var enable = undefined;
        if (enabletxt == 't') {
            enable = true,
            message.channel.send('Please respond with the role you would like to assign users when they join your server.')
    
            try {
                var rolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
                var role = rolein.first().content;
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
    joinrole.role = role;
    joinrole.enabled = enable;

    cfg[serverid].joinrole = joinrole;

    await bulidConfigFile();

    message.channel.send("Join Role Setup Complete!");
}
//#endregion

//#region music settings
async function setMusic(message) {
    var serverid = message.channel.guild.id;

    message.channel.send('Please respond with the role you would like to use as a DJ role.');
    
    try {
        var djrolein = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var djRole = djrolein.first().content;
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    message.channel.send('Pleas respont with the name of the text channel you would like the music commands to be used in.')

    try {
        var musictxtin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var textChannel = musictxtin.first().content;
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    if (djRole == undefined) {
        djRole = "DJ";
    }
    if (textChannel == undefined) {
        textChannel = "Music";
    }

    music = {};
    music.djRole = djRole;
    music.textChannel = textChannel;

    cfg[serverid].music = music;

    await bulidConfigFile();

    message.channel.send("Music Setup Complete!");
}
//#endregion

//#region general settings
async function setGeneral(message) {
    var serverid = message.channel.guild.id;

    message.channel.send('Please respond with the roles you would like to use as Bot Admins. Format it with a comma, followed by a space (`, `) seperating the roles. Example: `Role 1, Role 2, Role 3`.');
    
    try {
        var adminrolesin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var adminRoles = adminrolesin.first().content.split(', ');
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    message.channel.send('Please respond with the roles you would like to use as Bot Mods. Format it with a comma, followed by a space (`, `) seperating the roles. Example: `Role 1, Role 2,Role 3`.');

    try {
        var modrolesin = await message.channel.awaitMessages(msg2 => (!msg2.author.bot) ,{ max: 1, time: 120000, errors: ['time'] });
        var modRoles = modrolesin.first().content.split(', ');
    }
    catch (err) {
        return message.channel.send('Timeout Occured. Process Terminated.')
    }

    if (adminRoles == undefined) {
        adminRoles = [];
    }
    if (modRoles == undefined) {
        modRoles = [];
    }

    general = {};
    general.adminRoles = adminRoles;
    general.modRoles = modRoles;

    cfg[serverid].general = general;

    await bulidConfigFile();

    message.channel.send("General Setup Complete!");
}
//#endregion

//#region setup command
async function setup(message) {
    await addServerConfig(message.channel.guild.id);
    await setAutorole(message);
    await setGeneral(message);
    await setJoinrole(message);
    await setMusic(message);
    message.channel.send('Server Setup Complete');
}
//#endregion

//#region bulid configfile
async function bulidConfigFile() {
    await fs.writeFileSync('./data/serverconfig.json', JSON.stringify(cfg), function(err) {
        if (err) {
            console.log(err);
        }
    });

    await updateConfigFile();
}
//#endregion

//#region add server to configfile
function addServerConfig(serverid) {
    if (cfg[serverid] == undefined) {
        cfg[serverid] = {"autorole":{"embedMessage":"Not Set Up","embedFooter":"Not Set Up","roles":["Not Set Up"],"reactions":["🎵"]},"joinroles":{"role":"Not Set Up","enable":false},"music":{"djRoles":["Not Set Up"],"textChannel":"not-set-up"},"general":{"adminRoles":["Not Set Up"],"modRoles":["Not Set Up"]}};
    }

    bulidConfigFile();
}
//#endregion

//#region update configfile
function updateConfigFile() {
    cfg = JSON.parse(fs.readFileSync('./data/serverconfig.json', 'utf8'));
    return cfg;
}
//#endregion

//#region exports
module.exports = { setAutorole, setJoinrole, setMusic, setGeneral, setup, addServerConfig, updateConfigFile };
//#endregion