//#region Dependencies
import { GuildMemberRoleManager, PermissionFlagsBits, RoleManager } from 'discord.js';
import { ServerConfig } from '../models/serverConfigModel.js';
import { MessageWithDeleted } from '../models/messages.js';
//#endregion

//#region Function that calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays
/**
 * This function calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays (global).
 * @param sRole - Array of the roles in a server
 * @param serverID - The server ID
 * @returns An Array of roleID arrays [adminRoleIDs, modRoleIDs, djRoleIDs]
 */
async function serverRoleUpdate(sRole: RoleManager, serverConfig: ServerConfig) {
    //Gets serverConfig from database
    let adminRoleIDs = [];
    let modRoleIDs = [];
    let djRoleIDs = [];

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

    return [adminRoleIDs, modRoleIDs, djRoleIDs];
}
//#endregion

//#region Function that returns boolean for if the user who sent the message is a bot Admin (based off serverConfig.connection.adminRoles)
/**
 * This Function checks to see if the user who sent the message is a bot Admin (based off serverConfig.connection.adminRoles).
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot admin
 */
async function adminCheck(message: MessageWithDeleted, serverConfig: ServerConfig) {
    var userRolesArray: GuildMemberRoleManager;
    var serverRolesArray: RoleManager;

    if (message.member != null) {
        userRolesArray = message.member.roles;
        serverRolesArray = message.guild.roles;
    } else {
        return false;
    }

    //Checks to see if user is server admin
    if (message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return true;
    }

    //Calls a function that updates the server role information
    const permArrays = serverRoleUpdate(serverRolesArray, serverConfig);

    //Checks to see if any of the user role ids match any of the admin role ids
    for (let key in userRolesArray) {
        for (let a in permArrays[0]) {
            if (userRolesArray[key] == permArrays[0][a]) {
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
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot moderator
 */
function modCheck(message: MessageWithDeleted, serverConfig: ServerConfig) {
    var userRolesArray: GuildMemberRoleManager;
    var serverRolesArray: RoleManager;

    if (message.member != null) {
        userRolesArray = message.member.roles;
        serverRolesArray = message.guild.roles;
    } else {
        return false;
    }

    //Checks to see if user is admin
    if (adminCheck(message, serverConfig)) {
        return true;
    }

    //Calls a function that updates the server role information
    const permArrays = serverRoleUpdate(serverRolesArray, serverConfig);

    //Checks to see if user role ids match any of the mod role ids
    for (let key in userRolesArray) {
        for (let a in permArrays[1]) {
            if (userRolesArray[key] == permArrays[1][a]) {
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
function djCheck(message: MessageWithDeleted, serverConfig: ServerConfig) {
    var userRolesArray: GuildMemberRoleManager;
    var serverRolesArray: RoleManager;

    if (message.member != null) {
        userRolesArray = message.member.roles;
        serverRolesArray = message.guild.roles;
    } else {
        return false;
    }

    if (modCheck(message, serverConfig)) {
        return true;
    }

    const permArrays = serverRoleUpdate(serverRolesArray, serverConfig);

    if (permArrays[2].length != 0) {
        for (let key in userRolesArray) {
            for (let a in permArrays[2]) {
                if (userRolesArray[key] == permArrays[2][a]) {
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

//#region exports
export { adminCheck, modCheck, djCheck };
//#endregion
