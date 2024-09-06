//#region Dependencies
import { PermissionFlagsBits } from 'discord.js';
//#endregion
//#region Function that calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays
/**
 * This function calls the server roles and saves the roles that match the adminRoleIDs, modRoleIDs, and djRoleIDs in serverConfig to their own arrays (global).
 * @param sRole - Array of the roles in a server
 * @param serverID - The server ID
 * @returns An Array of roleID arrays [adminRoleIDs, modRoleIDs, djRoleIDs]
 */
function serverRoleUpdate(sRole, serverConfig) {
    //Gets serverConfig from database
    const adminRoleIDs = [];
    const modRoleIDs = [];
    const djRoleIDs = [];
    //Sets Local Variables
    const basicServerRoles = {};
    //Saves the Server Roles to an object by name
    for (const [key, value] of sRole.cache) {
        basicServerRoles[value.name] = key;
    }
    //Loops through the Admin Role Names, pushing them to an array
    for (const key of serverConfig.general.adminRoles) {
        //Pushes role IDs to Admin if they Match serverConfig.general.adminRoles
        if (basicServerRoles[key]) {
            adminRoleIDs.push(basicServerRoles[key]);
        }
    }
    //Loops through the Mod Role Names, pushing them to an array
    for (const key of serverConfig.general.modRoles) {
        //Pushes role IDs to Mods if they Match serverConfig.general.modRoles
        if (basicServerRoles[key]) {
            modRoleIDs.push(basicServerRoles[key]);
        }
    }
    //Loops through the DJ Role Names, pushing them to an array
    for (const key of serverConfig.music.djRoles) {
        //Pushes role IDs to DJs if they Match serverConfig.music.djRoles
        if (basicServerRoles[key]) {
            djRoleIDs.push(basicServerRoles[key]);
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
function adminCheck(message, serverConfig) {
    //#region Escape Logic
    //Checks that a member exists on the message
    if (!message.member) {
        return false;
    }
    //Checks to see if user is server admin
    if (message.memberPermissions.has(PermissionFlagsBits.Administrator)) {
        return true;
    }
    //#endregion
    //#region Main Logic - Runs the check and returns true if user is bot admin
    //Calls a function that updates the server role information
    const permArrays = serverRoleUpdate(message.guild.roles, serverConfig);
    //Checks to see if any of the user role ids match any of the admin role ids
    for (const role in message.member.roles) {
        for (const permRole of permArrays[0]) {
            if (message.member.roles[role] == permRole) {
                return true;
            }
        }
    }
    return false;
    //#endregion
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot Moderator (based off serverConfig.connection.modRoles)
/**
 * This Function checks to see if the user who sent the message is a bot Moderator (based off serverConfig.connection.adminRoles).
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot moderator
 */
function modCheck(message, serverConfig) {
    //#region Escape Logic
    //Checks that a member exists on the message
    if (!message.member) {
        return false;
    }
    //Checks to see if user is bot admin
    if (adminCheck(message, serverConfig)) {
        return true;
    }
    //#endregion
    //#region Main Logic - Runs the check and returns true if user is bot mod
    //Calls a function that updates the server role information
    const permArrays = serverRoleUpdate(message.guild.roles, serverConfig);
    //Checks to see if user role ids match any of the mod role ids
    for (const role in message.member.roles) {
        for (const permRole of permArrays[1]) {
            if (message.member.roles[role] == permRole) {
                return true;
            }
        }
    }
    return false;
    //#endregion
}
//#endregion
//#region Function that returns boolean for if the user who sent the message is a bot DJ (based off serverConfig.connection.djRole)
/**
 * This Function checks to see if the user who sent the message is a bot DJ (based off serverConfig.connection.adminRoles).
 * @param message - Discord.js Message Object
 * @returns True if the user in the message object is a bot DJ
 */
function djCheck(message, serverConfig) {
    //#region Escape Logic
    //Checks that a member exists on the message
    if (message.member != null) {
        return false;
    }
    //Checks to see if user is a bot mod
    if (modCheck(message, serverConfig)) {
        return true;
    }
    const permArrays = serverRoleUpdate(message.guild.roles, serverConfig);
    //Checks to see if the DJ role is set
    if (permArrays[2].length != 0) {
        return true;
    }
    //#endregion
    //#region Main Logic - Runs the check and returns true if user is a DJ
    for (const role in message.member.roles) {
        for (const permRole of permArrays[2]) {
            if (message.member.roles[role] == permRole) {
                return true;
            }
        }
    }
    return false;
    //#endregion
}
//#endregion
//#region exports
export { adminCheck, modCheck, djCheck };
//#endregion
