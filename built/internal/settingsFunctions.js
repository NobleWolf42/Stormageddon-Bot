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
import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
import { embedCustom } from '../helpers/embedMessages.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion
//Defining a filter for the setup commands to ignore bot messages
const msgFilter = (m) => !m.author.bot;
//Defining some buttons used in all the setup functions
const enable = new ButtonBuilder().setCustomId('enable').setLabel('Enable').setStyle(ButtonStyle.Primary);
const disable = new ButtonBuilder().setCustomId('disable').setLabel('Disable').setStyle(ButtonStyle.Primary);
//#region Function that sets modMail settings
/**
 * This function runs the setup for the ModMail feature.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setModMail(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        var modList = [];
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        const embMsg = new EmbedBuilder().setTitle('ModMail Setup').setDescription('Select Enable To Turn this Feature on, Disable to Leave it off.').setColor('#F5820F');
        message.channel.send('Please respond with `T` if you would like to enable DMing to bot to DM mods, respond with `F` if you do not.');
        try {
            var enableIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var enableTXT = enableIn.first().content.toLowerCase();
            var enable = undefined;
            if (enableTXT == 't') {
                (enable = true), message.channel.send('Please @ the people you want to receive mod mail.');
                try {
                    var roleIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
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
        var modMail = {
            enable: false,
            modList: [],
        };
        modMail.enable = enable;
        modMail.modList = modList;
        serverConfig.modMail = modMail;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('Mod Mail Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that sets autoRole settings
/**
 * This function runs the setup for the AutoRole feature.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setAutoRole(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        message.channel.send('Example Message:');
        yield embedCustom(message, 'Role Message', '#FFFF00', '**React to the messages below to receive the associated role.**', {
            text: `If you do not receive the role try reacting again.`,
            iconURL: null,
        }, null, [], null, null);
        message.channel.send('Please respond with `T` if you would like to enable react to receive role feature, respond with `F` if you do not.');
        try {
            var enableIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var enableTXT = enableIn.first().content.toLowerCase();
            var enable = undefined;
            if (enableTXT == 't') {
                enable = true;
                message.channel.send('Please respond with the text you would like the reactRole message to contain. Replaces (`**React to the messages below to receive the associated role.**`) in the example. You have two minutes to respond to each setting.');
                try {
                    var embedMessageIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var embedMessage = embedMessageIn.first().content;
                }
                catch (err) {
                    console.log(err.message);
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
                var embedFooter = 'If you do not receive the role try reacting again.';
                message.channel.send('Please @ the roles you would like users to be able to assign to themselves.');
                try {
                    var embedRoleIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var roles = [];
                    embedRoleIn.first().mentions.roles.forEach((role) => roles.push(role.name));
                }
                catch (err) {
                    console.log(err.message);
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
                message.channel.send('Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces separating the reactions, like this: `🐕 🎩 👾`. (NOTE: You can use custom reactions as long as they are not animated and belong to this server)');
                try {
                    var embedReactIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var reactions = embedReactIn.first().content.split(' ');
                }
                catch (err) {
                    console.log(err.message);
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
            }
        }
        catch (err) {
            console.log(err.message);
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        if (embedMessage == undefined) {
            embedMessage = '`React to the emoji that matches the role you wish to receive.\nIf you would like to remove the role, simply remove your reaction!\n`';
        }
        if (embedFooter == undefined) {
            embedFooter = 'If you do not receive the role try reacting again.';
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
        var autoRole = {
            enable: false,
            embedMessage: '`React to the emoji that matches the role you wish to receive.\nIf you would like to remove the role, simply remove your reaction!\n`',
            embedFooter: 'If you do not receive the role try reacting again.',
            roles: [],
            reactions: [],
        };
        autoRole.enable = enable;
        autoRole.embedMessage = embedMessage;
        autoRole.embedFooter = embedFooter;
        autoRole.roles = roles;
        autoRole.reactions = reactions;
        serverConfig.autoRole = autoRole;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('Auto Role Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that sets joinRole settings
/**
 * This function runs the setup for the JoinRole feature.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setJoinRole(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        message.channel.send('Please respond with `T` if you would like to enable assign a user a role on server join, respond with `F` if you do not.');
        try {
            var enableIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var enableTXT = enableIn.first().content.toLowerCase();
            var enable = undefined;
            if (enableTXT == 't') {
                (enable = true), message.channel.send('Please @ the role you would like to assign users when they join your server.');
                try {
                    var roleIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var role = roleIn.first().mentions.roles.first().name;
                }
                catch (err) {
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
            }
        }
        catch (err) {
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        if (role == undefined) {
            role = '';
        }
        if (enable == undefined) {
            enable = false;
        }
        var joinRole = {
            enable: false,
            role: '',
        };
        joinRole.enable = enable;
        joinRole.role = role;
        serverConfig.joinRole = joinRole;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('Join Role Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that sets joinToCreateVC settings
/**
 * This function runs the setup for the joinToCreateVC feature.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setJoinToCreateVC(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        message.channel.send('Please respond with `T` if you would like to enable Join to Create VC functionality, respond with `F` if you do not.');
        try {
            var enableIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var enableTXT = enableIn.first().content.toLowerCase();
            var enable = undefined;
            if (enableTXT == 't') {
                enable = true;
                message.channel.send('Please input the channel id you want to use as a Join to Create Channel. `You can get this by enabling developer mode in discord, then right clicking the cannel and clicking copy channel id.`');
                try {
                    var JTCVCTXTIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var voiceChannel = JTCVCTXTIn.first().content;
                }
                catch (err) {
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
            }
        }
        catch (err) {
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        if (enable == undefined) {
            enable = false;
        }
        else if (voiceChannel == undefined) {
            enable = false;
        }
        var JTCVC = {
            enable: false,
            voiceChannel: undefined,
        };
        JTCVC.enable = enable;
        JTCVC.voiceChannel = voiceChannel;
        serverConfig.JTCVC = JTCVC;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('Music Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that sets music settings
/**
 * This function runs the setup for the Music feature.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setMusic(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        message.channel.send('Please respond with `T` if you would like to enable music functionality, respond with `F` if you do not.');
        try {
            var enableIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var enableTXT = enableIn.first().content.toLowerCase();
            var enable = undefined;
            if (enableTXT == 't') {
                enable = true;
                message.channel.send('Please @ the role you would like to use as a DJ role.');
                try {
                    var djRoleIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var djRoles = [];
                    djRoles.push(djRoleIn.first().mentions.roles.first().name);
                }
                catch (err) {
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
                message.channel.send('Please link the text channel you would like the music commands to be used in. `You can do that by typing "#" followed by the channel name.`');
                try {
                    var musicTXTIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var textChannel = message.guild.channels.cache.get(musicTXTIn.first().content.substring(2, musicTXTIn.first().content.length - 1)).name;
                }
                catch (err) {
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
            }
        }
        catch (err) {
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        if (djRoles == undefined) {
            djRoles = ['DJ'];
        }
        if (textChannel == undefined) {
            textChannel = 'Music';
        }
        if (enable == undefined) {
            enable = false;
        }
        var music = {
            enable: false,
            djRoles: ['DJ'],
            textChannel: 'Music',
        };
        music.enable = enable;
        music.djRoles = djRoles;
        music.textChannel = textChannel;
        serverConfig.music = music;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('Music Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that sets general settings
/**
 * This function runs the setup for the general features.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setGeneral(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        message.channel.send('Please @ the roles you would like to use as Bot Admins.');
        try {
            var adminRolesIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var adminRoles = [];
            adminRolesIn.first().mentions.roles.forEach((role) => adminRoles.push(role.name));
        }
        catch (err) {
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        message.channel.send('Please @ the roles you would like to use as Bot Mods. These automatically include you admin roles, if you wish to add none, simply reply `None`.');
        try {
            var modRolesIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var modRoles = adminRoles.map((x) => x);
            if (modRolesIn.first().content.toLowerCase() == 'none') {
                var modRoles = adminRoles.map((x) => x);
            }
            else {
                modRolesIn.first().mentions.roles.forEach((role) => modRoles.push(role.name));
            }
        }
        catch (err) {
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        if (adminRoles == undefined) {
            adminRoles = [];
        }
        if (modRoles == undefined) {
            modRoles = adminRoles.map((x) => x);
        }
        var general = {
            adminRoles: [],
            modRoles: [],
        };
        general.adminRoles = adminRoles;
        general.modRoles = modRoles;
        serverConfig.general = general;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('General Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that sets blame settings
/**
 * This function runs the setup for the blame features.
 * @param message - Discord.js Message Object
 * @returns Server Config JSON
 */
function setBlame(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        message.channel.send('Please respond with `T` if you would like to enable Blame functionality, respond with `F` if you do not.');
        try {
            var enableIn = yield message.channel.awaitMessages({
                filter: msgFilter,
                max: 1,
                time: 120000,
                errors: ['time'],
            });
            var enableTXT = enableIn.first().content.toLowerCase();
            var enable = undefined;
            var cursing = false;
            if (enableTXT == 't') {
                enable = true;
                message.channel.send('Please respond with `T` if you would like to enable explicit language (`fuck`), respond with `F` if you do not.');
                try {
                    var curseTXTIn = yield message.channel.awaitMessages({
                        filter: msgFilter,
                        max: 1,
                        time: 120000,
                        errors: ['time'],
                    });
                    var cursingText = curseTXTIn.first().content;
                }
                catch (err) {
                    return message.channel.send('Timeout Occurred. Process Terminated.');
                }
            }
        }
        catch (err) {
            return message.channel.send('Timeout Occurred. Process Terminated.');
        }
        if (enable == undefined) {
            enable = false;
        }
        if (cursingText == 'true') {
            cursing = true;
        }
        else {
            cursing = false;
        }
        var blame = {
            enable: false,
            cursing: false,
            offset: 0,
            permList: [],
            rotateList: [],
        };
        blame.enable = enable;
        blame.cursing = cursing;
        blame.offset = 0;
        blame.permList = [];
        blame.rotateList = [];
        serverConfig.blame = blame;
        yield buildConfigFile(serverConfig, serverID);
        message.channel.send('Blame Setup Complete!');
        return serverConfig;
    });
}
//#endregion
//#region Function that adds/removes from blame lists in settings
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param serverID - The id for the server this is run in
 * @param addTF - True makes it add the person, False removes them
 * @param permTF - True adds them to the permanent blame list, False adds them to the weekly rotation
 * @param person - Name of the person
 * @returns Server Config JSON
 */
function addRemoveBlame(serverID, addTF, permTF, user, serverConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        //Pulls the current blame lists
        //Gets serverConfig from database
        const blame = serverConfig.blame;
        let personFound = false;
        const person = user.id;
        if (permTF) {
            blame.permList.forEach((item) => {
                if (item == person) {
                    personFound = true;
                }
            });
            if (addTF) {
                blame.permList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (!personFound) {
                    blame.permList.push(person);
                }
                else {
                    throw {
                        name: 'PersonExists',
                        message: `${user} is already in the permanent blame list!`,
                    };
                }
            }
            else {
                blame.permList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (personFound) {
                    blame.permList = blame.permList.filter(function (item) {
                        return item !== person;
                    });
                }
                else {
                    throw {
                        name: 'PersonNotExists',
                        message: `${user} is not in the permanent blame list!`,
                    };
                }
            }
        }
        else {
            blame.rotateList.forEach((item) => {
                if (item == person) {
                    personFound = true;
                }
            });
            if (addTF) {
                blame.rotateList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (!personFound) {
                    blame.rotateList.push(person);
                }
                else {
                    throw {
                        name: 'PersonExists',
                        message: `${user} is already in the rotating blame list!`,
                    };
                }
            }
            else {
                blame.permList.forEach((item) => {
                    if (item == person) {
                        personFound = true;
                    }
                });
                if (personFound) {
                    blame.rotateList = blame.rotateList.filter(function (item) {
                        return item !== person;
                    });
                }
                else {
                    throw {
                        name: 'PersonNotExists',
                        message: `${user} is not in the rotating blame list!`,
                    };
                }
            }
        }
        serverConfig.blame = blame;
        return serverConfig;
    });
}
//#endregion
//#region Function that changes offsets for blame lists in settings
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param serverID - The id for the server this is run in
 * @param offset - Number of places to offset the blame by
 * @returns Server Config JSON
 */
function changeBlameOffset(serverID, offset) {
    return __awaiter(this, void 0, void 0, function* () {
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        //Pulls the current blame lists
        var blame = serverConfig.blame;
        blame.offset = offset;
        serverConfig.blame = blame;
        yield buildConfigFile(serverConfig, serverID);
        return serverConfig;
    });
}
//#endregion
//#region Function that runs all setup commands
/**
 * This function runs the setup for all features.
 * @param message - Discord.js Message Object
 * @returns Void
 */
function setup(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverID = message.guild.id;
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        //Sets up all commands
        yield setAutoRole(message);
        yield setGeneral(message);
        yield setJoinRole(message);
        yield setMusic(message);
        yield setModMail(message);
        yield setJoinToCreateVC(message);
        yield setBlame(message);
        //Removes the Setup Needed Tag
        serverConfig.setupNeeded = false;
        yield buildConfigFile(serverConfig, serverID);
        embedCustom(message, 'Server Setup Complete', '#5D3FD3', "**MAKE SURE TO PUT THE ROLE FOR THIS BOT ABOVE ROLES YOU WANT THE BOT TO MANAGE, if you don't the bot will not work properly!**", { text: `Requested by ${message.author.tag}`, iconURL: null }, null, [], null, null);
        return;
    });
}
//#endregion
//#region Function that builds config file
/**
 * This function builds the serverConfig file with the provided JSON.
 * @param config - String of JSON
 * @param serverID - String of numbers for the server/guild ID
 * @returns Void
 */
function buildConfigFile(config, serverID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const update = {
                _id: serverID,
                guildID: serverID,
                setupNeeded: config.setupNeeded,
                prefix: config.prefix,
                autoRole: {
                    enable: config.autoRole.enable,
                    embedMessage: config.autoRole.embedMessage,
                    embedFooter: config.autoRole.embedFooter,
                    roles: config.autoRole.roles,
                    reactions: config.autoRole.reactions,
                },
                joinRole: {
                    enable: config.joinRole.enable,
                    role: config.joinRole.role,
                },
                music: {
                    enable: config.music.enable,
                    djRoles: config.music.djRoles,
                    textChannel: config.music.textChannel,
                },
                general: {
                    adminRoles: config.general.adminRoles,
                    modRoles: config.general.modRoles,
                },
                modMail: {
                    enable: config.modMail.enable,
                    modList: config.modMail.modList,
                },
                JTCVC: {
                    enable: config.JTCVC.enable,
                    voiceChannel: config.JTCVC.voiceChannel,
                },
                blame: {
                    enable: config.blame.enable,
                    cursing: config.blame.cursing,
                    offset: config.blame.offset,
                    permList: config.blame.permList,
                    rotateList: config.blame.rotateList,
                },
                logging: {
                    enable: config.logging.enable,
                    loggingChannel: config.logging.loggingChannel,
                    voice: {
                        enable: config.logging.voice.enable,
                    },
                },
            };
            yield MongooseServerConfig.findByIdAndUpdate(serverID, update, {
                new: true,
                upsert: true,
            })
                .exec()
                .then(() => {
                console.log(`Updated ServerConfig for ${serverID}`);
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
//#endregion
//#region Function that adds the provided server to the serverConfig file
/**
 * This function adds the provided server to the serverConfig file.
 * @param serverID - Server ID for server to be added
 * @returns Void
 */
function addServerConfig(serverID) {
    return __awaiter(this, void 0, void 0, function* () {
        var defaultConfig = {
            _id: serverID,
            guildID: serverID,
            setupNeeded: true,
            prefix: '!',
            autoRole: {
                enable: false,
                embedMessage: 'Not Set Up',
                embedFooter: 'Not Set Up',
                roles: ['Not Set Up'],
                reactions: ['🎵'],
            },
            joinRole: {
                enable: false,
                role: 'Not Set Up',
            },
            music: {
                enable: false,
                djRoles: ['Not Set Up'],
                textChannel: 'Not Set Up',
            },
            general: {
                adminRoles: ['Not Set Up'],
                modRoles: ['Not Set Up'],
            },
            modMail: {
                enable: false,
                modList: [],
            },
            JTCVC: {
                enable: false,
                voiceChannel: 'Not Set Up',
            },
            blame: {
                enable: false,
                cursing: false,
                offset: 0,
                permList: [],
                rotateList: [],
            },
            logging: {
                enable: false,
                loggingChannel: 'Not Set Up',
                voice: {
                    enable: false,
                },
            },
        };
        buildConfigFile(defaultConfig, serverID);
        return;
    });
}
//#endregion
//#region Function that removes the provided server form the serverConfig file
/**
 * This function removes the provided server from the serverConfig file
 * @param serverID - Server ID for server to be added
 * @returns Void
 */
function removeServerConfig(serverID) {
    MongooseServerConfig.findByIdAndDelete(serverID);
    return;
}
//#endregion
//#region exports
export { setAutoRole, setJoinRole, setMusic, setGeneral, setup, setModMail, buildConfigFile, removeServerConfig, addServerConfig, setJoinToCreateVC, setBlame, addRemoveBlame, changeBlameOffset };
//#endregion
