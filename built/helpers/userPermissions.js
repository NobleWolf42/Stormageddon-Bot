"use strict";
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
//#region Dependencies
var PermissionFlagsBits = require('discord.js').PermissionFlagsBits;
var readFileSync = require('fs').readFileSync;
//#endregion
//#region Data FIles
var updateConfigFile = require('./currentSettings.js').updateConfigFile;
var Message = require('discord.js').Message;
//#endregion
//#region Modules
var serverConfig_1 = require("../models/serverConfig");
//#endregion
//Sets up global vars for following functions
var adminRoleIDs = [];
var djRoleIDs = [];
var modRoleIDs = [];
//#region Function that calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays
/**
 * This function calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays (global).
 * @param {Array} sRole - Array of the roles in a server
 * @param {number} serverID - The server ID
 */
function serverRoleUpdate(sRole, serverID) {
    return __awaiter(this, void 0, void 0, function () {
        var serverConfig, basicServerRoles, _i, _a, _b, key, value;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec().toObject()];
                case 1:
                    serverConfig = _c.sent();
                    adminRoleIDs = [];
                    djRoleIDs = [];
                    modRoleIDs = [];
                    basicServerRoles = {};
                    //Saves the Server Roles to an object by name
                    for (_i = 0, _a = sRole.cache; _i < _a.length; _i++) {
                        _b = _a[_i], key = _b[0], value = _b[1];
                        index = value.name;
                        basicServerRoles[index] = key;
                    }
                    //Loops through the Admin Role Names, pushing them to an array
                    for (key in serverConfig.general.adminRoles) {
                        //Pushes role IDs to Admin if they Match serverConfig.general.adminRoles
                        if (basicServerRoles[serverConfig.general.adminRoles[key]]) {
                            adminRoleIDs.push(basicServerRoles[serverConfig.general.adminRoles[key]]);
                        }
                    }
                    //Loops through the Mod Role Names, pushing them to an array
                    for (key in serverConfig.general.modRoles) {
                        //Pushes role IDs to Mods if they Match serverConfig.general.modRoles
                        if (basicServerRoles[serverConfig.general.modRoles[key]]) {
                            modRoleIDs.push(basicServerRoles[serverConfig.general.modRoles[key]]);
                        }
                    }
                    //Pushes role IDs to DJs if they Match serverConfig.music.djRoles
                    if (basicServerRoles[String(serverConfig.music.djRoles)] != undefined) {
                        djRoleIDs.push(basicServerRoles[String(serverConfig.music.djRoles)]);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot Admin (based off serverConfig.connection.adminRoles)
/**
 * This Function checks to see if the user who sent the message is a bot Admin (based off serverConfig.connection.adminRoles).
 * @param {Message} message - Discord.js Message Object
 * @returns {boolean} True if the user in the message object is a bot admin
 */
function adminCheck(message) {
    var userRolesArray = [];
    var serverRolesArray = [];
    var serverID = '';
    if (message.member != null) {
        userRolesArray = message.member._roles;
        serverRolesArray = message.guild.roles;
        serverID = message.guild.id;
    }
    else {
        return false;
    }
    serverConfig = updateConfigFile();
    //Checks to see if user is server admin
    if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return true;
    }
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverID);
    //Checks to see if any of the user role ids match any of the admin role ids
    for (key in userRolesArray) {
        for (a in adminRoleIDs) {
            if (userRolesArray[key] == adminRoleIDs[a]) {
                return true;
            }
        }
    }
    return false;
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot Moderator (based off serverConfig.connection.modRoles)
/**
 * This Function checks to see if the user who sent the message is a bot Moderator (based off serverConfig.connection.adminRoles).
 * @param {Message} message - Discord.js Message Object
 * @returns {boolean} True if the user in the message object is a bot moderator
 */
function modCheck(message) {
    var userRolesArray = [];
    var serverRolesArray = [];
    var serverID = '';
    if (message.member != null) {
        userRolesArray = message.member._roles;
        serverRolesArray = message.guild.roles;
        serverID = message.guild.id;
    }
    else {
        return false;
    }
    serverConfig = updateConfigFile();
    //Checks to see if user is admin
    if (adminCheck(message)) {
        return true;
    }
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverID);
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        for (a in modRoleIDs) {
            if (userRolesArray[key] == modRoleIDs[a]) {
                return true;
            }
        }
    }
    return false;
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot DJ (based off serverConfig.connection.djRole)
/**
 * This Function checks to see if the user who sent the message is a bot DJ (based off serverConfig.connection.adminRoles).
 * @param {Message} message - Discord.js Message Object
 * @returns {boolean} True if the user in the message object is a bot DJ
 */
function djCheck(message) {
    var userRolesArray = [];
    var serverRolesArray = [];
    var serverID = '';
    if (message.member != null) {
        userRolesArray = message.member._roles;
        serverRolesArray = message.guild.roles;
        serverID = message.guild.id;
    }
    else {
        return false;
    }
    serverConfig = updateConfigFile();
    serverRoleUpdate(serverRolesArray, serverID);
    if (djRoleIDs != []) {
        for (key in userRolesArray) {
            for (a in djRoleIDs) {
                if (userRolesArray[key] == djRoleIDs[a]) {
                    return true;
                }
            }
        }
    }
    else {
        return true;
    }
    return false;
}
//#endregion
//#region Function that refreshes the userInfo.json in memory
/**
 * This function refreshes the userInfo.json in memory.
 */
function refreshUser() {
    userAccountInfo = JSON.parse(readFileSync('./data/userInfo.json', 'utf8'));
}
//#endregion
//#region exports
module.exports = { adminCheck: adminCheck, modCheck: modCheck, djCheck: djCheck, refreshUser: refreshUser };
//#endregion
