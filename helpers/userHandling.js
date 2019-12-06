//#region Dependancies
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./data/serverconfig.json', 'utf8'));
var set = require('../commands/setsettings.js')

var adminRoleIDs = [];
var djRoleIDs = [];
var modRoleIDs = [];
//#endregion

//#region Server Roles
//Function that calls the server roles
function serverRoleUpdate(sRole, serverid) {
    
    config = set.updateConfigFile();
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops throught the Admin Role Names, pushing them to an array
    for (key in config[serverid].general.adminRoles) {
        
        //Pushes role IDs to Admin if they Match config[serverid].general.adminRoles
        if (basicServerRoles[config[serverid].general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[config[serverid].general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pushing them to an array
    for (key in config[serverid].general.modRoles) {
        
        //Pushes role IDs to Mods if they Match config[serverid].general.modRoles
        if (basicServerRoles[config[serverid].general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[config[serverid].general.modRoles[key]]);
        }
    }

    //Loops throught the DJ Role Names, pushing them to an array
    for (key in config[serverid].music.djRoles) {
        
        //Pushes role IDs to DJs if they Match config[serverid].music.djRoles
        if (basicServerRoles[config[serverid].music.djRoles[key]]){
            djRoleIDs.push(basicServerRoles[config[serverid].music.djRoles[key]]);
        }
    }

    console.log(djRoleIDs);
}
//#endregion

//#region Admin / Mod / DJ Check
//Function that returns boolean for if the user who sent the message is an Admin (based off config[serverid].connection.adminRoles)
function adminCheck(userRolesArray, serverRolesArray, serverid) {
    
    config = set.updateConfigFile();
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if any of the user role ids match any of the admin role ids
    for (key in userRolesArray) {
        
        for (a in adminRoleIDs) {

            if (userRolesArray[key] == adminRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a Moderator (based off config[serverid].connection.modRoles)
function modCheck(userRolesArray, serverRolesArray, serverid) {
    
    config = set.updateConfigFile();
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in modRoleIDs) {

            if (userRolesArray[key] == modRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}

//Function that returns boolean for if the user who sent the message is a DJ (based off config[serverid].connection.djRole)
function djCheck(userRolesArray, serverRolesArray, serverid) {
    
    config = set.updateConfigFile();
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray, serverid);
    
    //Checks to see if user role ids match any of the mod role ids
    for (key in userRolesArray) {
        
        for (a in djRoleIDs) {

            if (userRolesArray[key] == djRoleIDs [a]) {

                return true;
            }
        }
    }

    return false;
}
//#endregion

//#region Refresh User Account Info
function refreshUser() {
    userAccountInfo = JSON.parse(fs.readFileSync('./data/userinfo.json', 'utf8'));
}
//#endregion

//#region exports
module.exports = { adminCheck, modCheck, djCheck, refreshUser };
//#endregion