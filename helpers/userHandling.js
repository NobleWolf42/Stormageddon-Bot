//#region Dependancies
const { readFileSync } = require('fs');
const { updateConfigFile } = require("../helpers/currentsettings.js");
var serverConfig = updateConfigFile();

var adminRoleIDs = [];
var djRoleIDs = [];
var modRoleIDs = [];
//#endregion

//#region Function that updates the config file
function updateConfigFile() {
    serverConfig = JSON.parse(readFileSync('./data/serverconfig.json', 'utf8'));
    return serverConfig;
}
//#endregion

//#region Server Roles
//Function that calls the server roles
function serverRoleUpdate(sRole, serverID) {

    adminRoleIDs = [];
    djRoleIDs = [];
    modRoleIDs = [];
    
    serverConfig = updateConfigFile();
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole.cache) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops through the Admin Role Names, pushing them to an array
    for (key in serverConfig[serverID].general.adminRoles) {

        //Pushes role IDs to Admin if they Match serverConfig[serverID].general.adminRoles
        if (basicServerRoles[serverConfig[serverID].general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[serverConfig[serverID].general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pushing them to an array
    for (key in serverConfig[serverID].general.modRoles) {
        
        //Pushes role IDs to Mods if they Match serverConfig[serverID].general.modRoles
        if (basicServerRoles[serverConfig[serverID].general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[serverConfig[serverID].general.modRoles[key]]);
        }
    }
        
    //Pushes role IDs to DJs if they Match serverConfig[serverID].music.djRoles
    if (basicServerRoles[String(serverConfig[serverID].music.djRoles)] != undefined){
        djRoleIDs.push(basicServerRoles[String(serverConfig[serverID].music.djRoles)]);
    }
}
//#endregion

//#region Admin / Mod / DJ Check
//Function that returns boolean for if the user who sent the message is an Admin (based off serverConfig[serverID].connection.adminRoles)
function adminCheck(message) {
    var userRolesArray = [];
    var serverRolesArray = [];
    var serverID = '';
    
    if (message.author.lastMessage.member != null) {
        userRolesArray = message.author.lastMessage.member._roles;
        serverRolesArray = message.channel.guild.roles;
        serverID = message.channel.guild.id;
    }
    else {
        return false;
    }
    
    serverConfig = updateConfigFile();
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverID);
    
    //Checks to see if any of the user role ids match any of the admin role ids
    for (key in userRolesArray) {
        
        for (a in adminRoleIDs) {
            
            if(userRolesArray[key] == adminRoleIDs[a]) {
                
                return true;
            }
        }
    }
    
    return false;
}

//Function that returns boolean for if the user who sent the message is a Moderator (based off serverConfig[serverID].connection.modRoles)
function modCheck(message) {
    var userRolesArray = [];
    var serverRolesArray = [];
    var serverID = '';
    
    if (message.author.lastMessage.member != null) {
        userRolesArray = message.author.lastMessage.member._roles;
        serverRolesArray = message.channel.guild.roles;
        serverID = message.channel.guild.id;
    }
    else {
        return false;
    }


    serverConfig = updateConfigFile();
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverID);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in modRoleIDs) {

            if(userRolesArray[key] == modRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a DJ (based off serverConfig[serverID].connection.djRole)
function djCheck(message) {
    var userRolesArray = [];
    var serverRolesArray = [];
    var serverID = '';
    
    if (message.author.lastMessage.member != null) {
        userRolesArray = message.author.lastMessage.member._roles;
        serverRolesArray = message.channel.guild.roles;
        serverID = message.channel.guild.id;
        //console.log(userRolesArray);
        //console.log(serverRolesArray);
    }
    else {
        return false;
    }
    
    serverConfig = updateConfigFile();
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverID);
    //console.log(djRoleIDs);
    //Checks to see if user role ids match any of the mod role ids
    if (djRoleIDs != []) {
        for (key in userRolesArray) {
        
            for (a in djRoleIDs) {
    
                if(userRolesArray[key] == djRoleIDs [a]) {
    
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

//#region Refresh User Account Info
function refreshUser() {
    userAccountInfo = JSON.parse(readFileSync('./data/userinfo.json', 'utf8'));
}
//#endregion

//#region exports
module.exports = { adminCheck, modCheck, djCheck, refreshUser };
//#endregion