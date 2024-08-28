//#region Dependencies
const { PermissionFlagsBits } = require('discord.js');
const { readFileSync } = require('fs');
//#endregion

//#region Data FIles
const { updateConfigFile } = require('./currentSettings.js');
const { Message } = require('discord.js');
//#endregion

//#region Modules
import { MongooseServerConfig } from '../models/serverConfig';
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
async function serverRoleUpdate(sRole, serverID) {
    //Gets serverConfig from database
    var serverConfig = await MongooseServerConfig.findById(serverID).exec().toObject();

    adminRoleIDs = [];
    djRoleIDs = [];
    modRoleIDs = [];

    //Sets Local Variables
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole.cache) {
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
    } else {
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
    } else {
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
    } else {
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
    } else {
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
module.exports = { adminCheck, modCheck, djCheck, refreshUser };
//#endregion
