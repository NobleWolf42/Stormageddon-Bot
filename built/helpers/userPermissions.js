var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#region Dependencies
import { PermissionFlagsBits } from 'discord.js';
//#endregion
//#region Modules
import { MongooseServerConfig } from '../models/serverConfig.js';
//#endregion
//Sets up global vars for following functions This is horrible, fix this later, why are these global I hate past me it consume so much more cache read/writes
let adminRoleIDs = [];
let djRoleIDs = [];
let modRoleIDs = [];
//#region Function that calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays
/**
 * This function calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays (global).
 * @param sRole - Array of the roles in a server
 * @param serverID - The server ID
 */
function serverRoleUpdate(sRole, serverID) {
    return __awaiter(this, void 0, void 0, function* () {
        //Gets serverConfig from database
        var serverConfig = (yield MongooseServerConfig.findById(serverID).exec()).toObject();
        adminRoleIDs = [];
        djRoleIDs = [];
        modRoleIDs = [];
        //Sets Local Variables
        var basicServerRoles = {};
        //Saves the Server Roles to an object by name
        for (let [key, value] of sRole.cache) {
            let index = value.name;
            basicServerRoles[index] = key;
        }
        //Loops through the Admin Role Names, pushing them to an array
        for (let key in serverConfig.general.adminRoles) {
            //Pushes role IDs to Admin if they Match serverConfig.general.adminRoles
            if (basicServerRoles[serverConfig.general.adminRoles[key]]) {
                adminRoleIDs.push(basicServerRoles[serverConfig.general.adminRoles[key]]);
            }
        }
        //Loops through the Mod Role Names, pushing them to an array
        for (let key in serverConfig.general.modRoles) {
            //Pushes role IDs to Mods if they Match serverConfig.general.modRoles
            if (basicServerRoles[serverConfig.general.modRoles[key]]) {
                modRoleIDs.push(basicServerRoles[serverConfig.general.modRoles[key]]);
            }
        }
        //Loops through the DJ Role Names, pushing them to an array
        for (let key in serverConfig.music.djRoles) {
            //Pushes role IDs to DJs if they Match serverConfig.music.djRoles
            if (basicServerRoles[serverConfig.music.djRoles[key]] != undefined) {
                djRoleIDs.push(basicServerRoles[serverConfig.music.djRoles[key]]);
            }
        }
    });
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot Admin (based off serverConfig.connection.adminRoles)
/**
 * This Function checks to see if the user who sent the message is a bot Admin (based off serverConfig.connection.adminRoles).
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot admin
 */
function adminCheck(message) {
    return __awaiter(this, void 0, void 0, function* () {
        var userRolesArray;
        var serverRolesArray;
        var serverID = '';
        if (message.member != null) {
            userRolesArray = message.member.roles;
            serverRolesArray = message.guild.roles;
            serverID = message.guild.id;
        }
        else {
            return false;
        }
        //Checks to see if user is server admin
        if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return true;
        }
        //Calls a function that updates the server role information
        serverRoleUpdate(serverRolesArray, serverID);
        //Checks to see if any of the user role ids match any of the admin role ids
        for (let key in userRolesArray) {
            for (let a in adminRoleIDs) {
                if (userRolesArray[key] == adminRoleIDs[a]) {
                    return true;
                }
            }
        }
        return false;
    });
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot Moderator (based off serverConfig.connection.modRoles)
/**
 * This Function checks to see if the user who sent the message is a bot Moderator (based off serverConfig.connection.adminRoles).
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot moderator
 */
function modCheck(message) {
    var userRolesArray;
    var serverRolesArray;
    var serverID = '';
    if (message.member != null) {
        userRolesArray = message.member.roles;
        serverRolesArray = message.guild.roles;
        serverID = message.guild.id;
    }
    else {
        return false;
    }
    //Checks to see if user is admin
    if (adminCheck(message)) {
        return true;
    }
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverID);
    //Checks to see if user role ids match any of the mod role ids
    for (let key in userRolesArray) {
        for (let a in modRoleIDs) {
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
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot DJ
 */
function djCheck(message) {
    var userRolesArray;
    var serverRolesArray;
    var serverID = '';
    if (message.member != null) {
        userRolesArray = message.member.roles;
        serverRolesArray = message.guild.roles;
        serverID = message.guild.id;
    }
    else {
        return false;
    }
    if (modCheck(message)) {
        return true;
    }
    serverRoleUpdate(serverRolesArray, serverID);
    if (djRoleIDs.length != 0) {
        for (let key in userRolesArray) {
            for (let a in djRoleIDs) {
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
//#region exports
export { adminCheck, modCheck, djCheck };
//#endregion
