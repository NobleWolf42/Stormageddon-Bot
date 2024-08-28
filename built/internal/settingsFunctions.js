"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//#region Helpers
var embedMessages_js_1 = require("../helpers/embedMessages.js");
//#endregion
//#region Modules
var serverConfig_1 = require("../models/serverConfig");
//#endregion
//Defining a filter for the setup commands to ignore bot messages
var msgFilter = function (m) { return !m.author.bot; };
//#region Function that sets modMail settings
/**
 * This function runs the setup for the ModMail feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setModMail(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, modList, serverConfig, enableIn, enableTXT, enable, roleIn, err_1, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    modList = [];
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Please respond with `T` if you would like to enable DMing to bot to DM mods, respond with `F` if you do not.');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 3:
                    enableIn = _a.sent();
                    enableTXT = enableIn.first().content.toLowerCase();
                    enable = undefined;
                    if (!(enableTXT == 't')) return [3 /*break*/, 7];
                    (enable = true), message.channel.send('Please @ the people you want to receive mod mail.');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 5:
                    roleIn = _a.sent();
                    roleIn.first().mentions.members.forEach(function (member) {
                        modList.push(member.id);
                    });
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 9:
                    if (modList == undefined) {
                        modList = [];
                    }
                    if (enable == undefined) {
                        enable = false;
                    }
                    modMail = {};
                    modMail.enable = enable;
                    modMail.modList = modList;
                    serverConfig.modMail = modMail;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 10:
                    _a.sent();
                    message.channel.send('Mod Mail Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 11:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that sets autoRole settings
/**
 * This function runs the setup for the AutoRole feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setAutoRole(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig, enableIn, enableTXT, enable, embedMessageIn, embedMessage, err_3, embedFooter, embedRoleIn, roles, err_4, embedReactIn, reactions, err_5, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Example Message:');
                    return [4 /*yield*/, (0, embedMessages_js_1.embedCustom)(message, 'Role Message', '#FFFF00', '**React to the messages below to receive the associated role.**', {
                            text: "If you do not receive the role try reacting again.",
                            iconURL: null,
                        }, null, [], null, null)];
                case 2:
                    _a.sent();
                    message.channel.send('Please respond with `T` if you would like to enable react to receive role feature, respond with `F` if you do not.');
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 17, , 18]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 4:
                    enableIn = _a.sent();
                    enableTXT = enableIn.first().content.toLowerCase();
                    enable = undefined;
                    if (!(enableTXT == 't')) return [3 /*break*/, 16];
                    enable = true;
                    message.channel.send('Please respond with the text you would like the reactRole message to contain. Replaces (`**React to the messages below to receive the associated role.**`) in the example. You have two minutes to respond to each setting.');
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 6:
                    embedMessageIn = _a.sent();
                    embedMessage = embedMessageIn.first().content;
                    return [3 /*break*/, 8];
                case 7:
                    err_3 = _a.sent();
                    console.log(err_3.message);
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 8:
                    embedFooter = 'If you do not receive the role try reacting again.';
                    message.channel.send('Please @ the roles you would like users to be able to assign to themselves.');
                    _a.label = 9;
                case 9:
                    _a.trys.push([9, 11, , 12]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 10:
                    embedRoleIn = _a.sent();
                    roles = [];
                    embedRoleIn.first().mentions.roles.forEach(function (role) { return roles.push(role.name); });
                    return [3 /*break*/, 12];
                case 11:
                    err_4 = _a.sent();
                    console.log(err_4.message);
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 12:
                    message.channel.send('Please respond to this message with the list of reactions you want to be used for the roles above, matching their order. Format the list with spaces separating the reactions, like this: `🐕 🎩 👾`. (NOTE: You can use custom reactions as long as they are not animated and belong to this server)');
                    _a.label = 13;
                case 13:
                    _a.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 14:
                    embedReactIn = _a.sent();
                    reactions = embedReactIn.first().content.split(' ');
                    return [3 /*break*/, 16];
                case 15:
                    err_5 = _a.sent();
                    console.log(err_5.message);
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 16: return [3 /*break*/, 18];
                case 17:
                    err_6 = _a.sent();
                    console.log(err_6.message);
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 18:
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
                    autoRole = {};
                    autoRole.enable = enable;
                    autoRole.embedMessage = embedMessage;
                    autoRole.embedFooter = embedFooter;
                    autoRole.roles = roles;
                    autoRole.reactions = reactions;
                    serverConfig.autoRole = autoRole;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 19:
                    _a.sent();
                    message.channel.send('Auto Role Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 20:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that sets joinRole settings
/**
 * This function runs the setup for the JoinRole feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setJoinRole(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig, enableIn, enableTXT, enable, roleIn, role, err_7, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Please respond with `T` if you would like to enable assign a user a role on server join, respond with `F` if you do not.');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 3:
                    enableIn = _a.sent();
                    enableTXT = enableIn.first().content.toLowerCase();
                    enable = undefined;
                    if (!(enableTXT == 't')) return [3 /*break*/, 7];
                    (enable = true), message.channel.send('Please @ the role you would like to assign users when they join your server.');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 5:
                    roleIn = _a.sent();
                    role = roleIn.first().mentions.roles.first().name;
                    console.log(role);
                    return [3 /*break*/, 7];
                case 6:
                    err_7 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_8 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 9:
                    if (role == undefined) {
                        role = '';
                    }
                    if (enable == undefined) {
                        enable = false;
                    }
                    joinRole = {};
                    joinRole.enabled = enable;
                    joinRole.role = role;
                    serverConfig.joinRole = joinRole;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 10:
                    _a.sent();
                    message.channel.send('Join Role Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 11:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that sets joinToCreateVC settings
/**
 * This function runs the setup for the joinToCreateVC feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setJoinToCreateVC(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig, enableIn, enableTXT, enable, JTCVCTXTIn, voiceChannel, err_9, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Please respond with `T` if you would like to enable Join to Create VC functionality, respond with `F` if you do not.');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 3:
                    enableIn = _a.sent();
                    enableTXT = enableIn.first().content.toLowerCase();
                    enable = undefined;
                    if (!(enableTXT == 't')) return [3 /*break*/, 7];
                    enable = true;
                    message.channel.send('Please input the channel id you want to use as a Join to Create Channel. `You can get this by enabling developer mode in discord, then right clicking the cannel and clicking copy channel id.`');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 5:
                    JTCVCTXTIn = _a.sent();
                    voiceChannel = JTCVCTXTIn.first().content;
                    return [3 /*break*/, 7];
                case 6:
                    err_9 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_10 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 9:
                    if (enable == undefined) {
                        enable = false;
                    }
                    else if (voiceChannel == undefined) {
                        enable = false;
                    }
                    JTCVC = {};
                    JTCVC.enable = enable;
                    JTCVC.voiceChannel = voiceChannel;
                    serverConfig.JTCVC = JTCVC;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 10:
                    _a.sent();
                    message.channel.send('Music Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 11:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that sets music settings
/**
 * This function runs the setup for the Music feature.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setMusic(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig, enableIn, enableTXT, enable, djRoleIn, djRoles, err_11, musicTXTIn, textChannel, err_12, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Please respond with `T` if you would like to enable music functionality, respond with `F` if you do not.');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 12, , 13]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 3:
                    enableIn = _a.sent();
                    enableTXT = enableIn.first().content.toLowerCase();
                    enable = undefined;
                    if (!(enableTXT == 't')) return [3 /*break*/, 11];
                    enable = true;
                    message.channel.send('Please @ the role you would like to use as a DJ role.');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 5:
                    djRoleIn = _a.sent();
                    djRoles = djRoleIn.first().mentions.roles.first().name;
                    console.log(djRoles);
                    return [3 /*break*/, 7];
                case 6:
                    err_11 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 7:
                    message.channel.send('Please link the text channel you would like the music commands to be used in. `You can do that by typing "#" followed by the channel name.`');
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 9:
                    musicTXTIn = _a.sent();
                    textChannel = message.guild.channels.cache.get(musicTXTIn.first().content.substring(2, musicTXTIn.first().content.length - 1)).name;
                    return [3 /*break*/, 11];
                case 10:
                    err_12 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 11: return [3 /*break*/, 13];
                case 12:
                    err_13 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 13:
                    if (djRoles == undefined) {
                        djRoles = 'DJ';
                    }
                    if (textChannel == undefined) {
                        textChannel = 'Music';
                    }
                    if (enable == undefined) {
                        enable = false;
                    }
                    music = {};
                    music.enable = enable;
                    music.djRoles = djRoles;
                    music.textChannel = textChannel;
                    serverConfig.music = music;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 14:
                    _a.sent();
                    message.channel.send('Music Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 15:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that sets general settings
/**
 * This function runs the setup for the general features.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setGeneral(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig, adminRolesIn, adminRoles, err_14, modRolesIn, modRoles, modRoles, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Please @ the roles you would like to use as Bot Admins.');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 3:
                    adminRolesIn = _a.sent();
                    adminRoles = [];
                    adminRolesIn.first().mentions.roles.forEach(function (role) { return adminRoles.push(role.name); });
                    return [3 /*break*/, 5];
                case 4:
                    err_14 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 5:
                    message.channel.send('Please @ the roles you would like to use as Bot Mods. These automatically include you admin roles, if you wish to add none, simply reply `None`.');
                    _a.label = 6;
                case 6:
                    _a.trys.push([6, 8, , 9]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 7:
                    modRolesIn = _a.sent();
                    modRoles = adminRoles.map(function (x) { return x; });
                    if (modRolesIn.first().content.toLowerCase() == 'none') {
                        modRoles = adminRoles.map(function (x) { return x; });
                    }
                    else {
                        modRolesIn.first().mentions.roles.forEach(function (role) { return modRoles.push(role.name); });
                    }
                    return [3 /*break*/, 9];
                case 8:
                    err_15 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 9:
                    if (adminRoles == undefined) {
                        adminRoles = [];
                    }
                    if (modRoles == undefined) {
                        modRoles = adminRoles.map(function (x) { return x; });
                    }
                    general = {};
                    general.adminRoles = adminRoles;
                    general.modRoles = modRoles;
                    serverConfig.general = general;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 10:
                    _a.sent();
                    message.channel.send('General Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 11:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that sets blame settings
/**
 * This function runs the setup for the blame features.
 * @param {Message} message - Discord.js Message Object
 * @returns {JSON} Server Config JSON
 */
function setBlame(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig, enableIn, enableTXT, enable, cursing, curseTXTIn, cursing, err_16, err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    message.channel.send('Please respond with `T` if you would like to enable Blame functionality, respond with `F` if you do not.');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 8, , 9]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 3:
                    enableIn = _a.sent();
                    enableTXT = enableIn.first().content.toLowerCase();
                    enable = undefined;
                    cursing = undefined;
                    if (!(enableTXT == 't')) return [3 /*break*/, 7];
                    enable = true;
                    message.channel.send('Please respond with `T` if you would like to enable explicit language (`fuck`), respond with `F` if you do not.');
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, message.channel.awaitMessages({
                            filter: msgFilter,
                            max: 1,
                            time: 120000,
                            errors: ['time'],
                        })];
                case 5:
                    curseTXTIn = _a.sent();
                    cursing = curseTXTIn.first().content;
                    return [3 /*break*/, 7];
                case 6:
                    err_16 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 7: return [3 /*break*/, 9];
                case 8:
                    err_17 = _a.sent();
                    return [2 /*return*/, message.channel.send('Timeout Occurred. Process Terminated.')];
                case 9:
                    if (enable == undefined) {
                        enable = false;
                    }
                    if (cursing == undefined) {
                        cursing = false;
                    }
                    blame = {};
                    blame.enable = enable;
                    blame.cursing = cursing;
                    blame.offset = 0;
                    blame.permList = [];
                    blame.rotateList = [];
                    serverConfig.blame = blame;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 10:
                    _a.sent();
                    message.channel.send('Blame Setup Complete!');
                    return [4 /*yield*/, updateConfigFile()];
                case 11:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that adds/removes from blame lists in settings
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param {String} serverID - The id for the server this is run in
 * @param {Boolean} addTF - True makes it add the person, False removes them
 * @param {Boolean} permTF - True adds them to the permanent blame list, False adds them to the weekly rotation
 * @param {String} person - Name of the person
 * @returns {JSON} Server Config JSON
 */
function addRemoveBlame(serverID, addTF, permTF, person) {
    return __awaiter(this, void 0, void 0, function () {
        var serverConfig, blame, personFound;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    blame = serverConfig.blame;
                    personFound = false;
                    if (permTF) {
                        blame.permList.forEach(function (item) {
                            if (item == person) {
                                personFound = true;
                            }
                        });
                        if (addTF) {
                            blame.permList.forEach(function (item) {
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
                                    message: "".concat(person, " is already in the permanent blame list!"),
                                };
                            }
                        }
                        else {
                            blame.permList.forEach(function (item) {
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
                                    message: "".concat(person, " is not in the permanent blame list!"),
                                };
                            }
                        }
                    }
                    else {
                        blame.rotateList.forEach(function (item) {
                            if (item == person) {
                                personFound = true;
                            }
                        });
                        if (addTF) {
                            blame.rotateList.forEach(function (item) {
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
                                    message: "".concat(person, " is already in the rotating blame list!"),
                                };
                            }
                        }
                        else {
                            blame.permList.forEach(function (item) {
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
                                    message: "".concat(person, " is not in the rotating blame list!"),
                                };
                            }
                        }
                    }
                    serverConfig.blame = blame;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateConfigFile()];
                case 3:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that changes offsets for blame lists in settings
/**
 * This function takes several inputs and adds/removes someone from the blame command.
 * @param {String} serverID - The id for the server this is run in
 * @param {Boolean} addTF - True makes it add the person, False removes them
 * @param {Boolean} permTF - True adds them to the permanent blame list, False adds them to the weekly rotation
 * @param {String} person - Name of the person
 * @returns {JSON} Server Config JSON
 */
function changeBlameOffset(serverID, offset) {
    return __awaiter(this, void 0, void 0, function () {
        var serverConfig, blame;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    blame = serverConfig.blame;
                    blame.offset = offset;
                    serverConfig.blame = blame;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, updateConfigFile()];
                case 3:
                    config = _a.sent();
                    return [2 /*return*/, config];
            }
        });
    });
}
//#endregion
//#region Function that runs all setup commands
/**
 * This function runs the setup for all features.
 * @param {Message} message - Discord.js Message Object
 * @returns {void} Void
 */
function setup(message) {
    return __awaiter(this, void 0, void 0, function () {
        var serverID, serverConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    serverID = message.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _a.sent();
                    //Sets up all commands
                    return [4 /*yield*/, setAutoRole(message)];
                case 2:
                    //Sets up all commands
                    _a.sent();
                    return [4 /*yield*/, setGeneral(message)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, setJoinRole(message)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, setMusic(message)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, setModMail(message)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, setJoinToCreateVC(message)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, setBlame(message)];
                case 8:
                    _a.sent();
                    //Removes the Setup Needed Tag
                    serverConfig.setupNeeded = false;
                    return [4 /*yield*/, buildConfigFile(serverConfig, serverID)];
                case 9:
                    _a.sent();
                    (0, embedMessages_js_1.embedCustom)(message, 'Server Setup Complete', '#5D3FD3', "**MAKE SURE TO PUT THE ROLE FOR THIS BOT ABOVE ROLES YOU WANT THE BOT TO MANAGE, if you don't the bot will not work properly!**", { text: "Requested by ".concat(message.author.tag), iconURL: null }, null, [], null, null);
                    return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that builds config file
/**
 * This function builds the serverConfig file with the provided JSON.
 * @param {string} config - String of JSON
 */
function buildConfigFile(config, serverID) {
    return __awaiter(this, void 0, void 0, function () {
        var newConfig, typeScriptNewConfig, err_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 3];
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 2:
                    newConfig = _a.sent();
                    newConfig.setupNeeded = config.setupNeeded;
                    newConfig.prefix = config.prefix;
                    newConfig.autoRole = config.autoRole;
                    newConfig.joinRole = config.joinRole;
                    newConfig.music = config.music;
                    newConfig.general = config.general;
                    newConfig.modMail = config.modMail;
                    newConfig.JTCVC = config.JTCVC;
                    newConfig.blame = config.blame;
                    return [3 /*break*/, 4];
                case 3:
                    typeScriptNewConfig = {
                        _id: serverID,
                        guildID: serverID,
                        setupNeeded: config.setupNeeded,
                        prefix: config.prefix,
                        autoRole: config.autoRole,
                        joinRole: config.joinRole,
                        music: config.music,
                        general: config.general,
                        modMail: config.modMail,
                        JTCVC: config.JTCVC,
                        blame: config.blame,
                    };
                    newConfig = new serverConfig_1.MongooseServerConfig(__assign({}, typeScriptNewConfig));
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, newConfig.save()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_18 = _a.sent();
                    console.log(err_18);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that adds the provided server to the serverConfig.json file
/**
 * This function adds the provided server to the serverConfig.json file.
 * @param {number} serverID - Server ID for server to be added
 */
function addServerConfig(serverID) {
    return __awaiter(this, void 0, void 0, function () {
        var defaultConfig;
        return __generator(this, function (_a) {
            defaultConfig = {
                setupNeeded: true,
                prefix: '!',
                autoRole: {
                    enable: false,
                    embedMessage: 'Not Set Up',
                    embedFooter: 'Not Set Up',
                    roles: ['Not Set Up'],
                    reactions: ['🎵'],
                },
                joinRole: { enable: false, role: 'Not Set Up' },
                music: {
                    enable: false,
                    djRoles: ['Not Set Up'],
                    textChannel: 'Not Set Up',
                },
                general: { adminRoles: ['Not Set Up'], modRoles: ['Not Set Up'] },
                modMail: { enable: false, modList: [] },
                JTCVC: { enable: false, voiceChannel: 'Not Set Up' },
                blame: {
                    enable: false,
                    cursing: false,
                    offset: 0,
                    permList: [],
                    rotateList: [],
                },
                logging: {
                    enabled: false,
                    loggingChannel: 'Not Set Up',
                    voice: {
                        enabled: false,
                    },
                },
            };
            buildConfigFile(defaultConfig, serverID);
            return [2 /*return*/];
        });
    });
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
module.exports = {
    setAutoRole: setAutoRole,
    setJoinRole: setJoinRole,
    setMusic: setMusic,
    setGeneral: setGeneral,
    setup: setup,
    setModMail: setModMail,
    buildConfigFile: buildConfigFile,
    removeServerConfig: removeServerConfig,
    addServerConfig: addServerConfig,
    setJoinToCreateVC: setJoinToCreateVC,
    setBlame: setBlame,
    addRemoveBlame: addRemoveBlame,
    changeBlameOffset: changeBlameOffset,
};
//#endregion
