var Discord = require('discord.js');
var config = require('./config.json');
var adminRoleIDs = [];
var modRoleIDs = [];

// Initialize Discord Bot
var client = new Discord.Client();

//Throws Error if bot's token is not set.
if (config.auth.token === 'YOUR BOT TOKEN' || config.auth.token === '') {
    throw new Error("The 'auth.token' property is not set in the config.js file. Please do this!");
}

//Logs the bot into discord, using it's auth token
client.login(config.auth.token);

//Logs the Bot info when bot starts
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
});

//Logs Errors
client.on('error', console.error);

//Function that calls the server roles
function serverRoleUpdate(sRole) {
    
    //Sets Local Varibles
    var basicServerRoles = {};

    //Saves the Server Roles to an object by name
    for (let [key, value] of sRole) {
        index = value.name;
        basicServerRoles[index] = key;
    }

    //Loops throught the Admin Role Names, pusing them to an array
    for (key in config.general.adminRoles) {
        
        //Pushes role IDs to Admin if they Match config.general.adminRoles
        if (basicServerRoles[config.general.adminRoles[key]]){
            adminRoleIDs.push(basicServerRoles[config.general.adminRoles[key]]);
        }
    }

    //Loops throught the Mod Role Names, pusing them to an array
    for (key in config.general.modRoles) {
        
        //Pushes role IDs to Mods if they Match config.general.modRoles
        if (basicServerRoles[config.general.modRoles[key]]){
            modRoleIDs.push(basicServerRoles[config.general.modRoles[key]]);
        }
    }
}

//Function that returns boolean for if the user who sent the message is an Admin (based off config.connection.adminRoles)
function adminCheck(userRolesArray, serverRolesArray) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray);
    
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

//Function that returns boolean for if the user who sent the message is a Moderator (based off config.connection.modRoles)
function modCheck(userRolesArray, serverRolesArray) {
    
    //Calls a function that updates the server role information
    serverRoleUpdate(serverRolesArray);
    
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

//Handels Messages and their responses
client.on("message", message => {

    //Varibles for the message info needed
    var userInput = message.content.toLowerCase();
    var userRoles = message.author.lastMessage.member._roles;
    var serverRoles = message.channel.guild.roles;
    var adminTF = adminCheck(userRoles, serverRoles);
    var modTF = modCheck(userRoles, serverRoles);

    //Runs AutoRole Message Generation
    if ((adminTF == true) && (userInput == (config.general.botPrefix + config.autorole.setupCMD))){
        console.log("AUTOROLE!!!");
    };
});