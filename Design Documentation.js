/*This file lays out the way to layout a command file make sure to put everything in its own region with a description so that it can be collapsed
all commands go in the ./commands folder, the bot is coded so that it will load all fines in that folder, following this design, as commands the bot can run.*/

//#region Dependencies
 
//Dependencies are classed as external packages that we load in, we should only load in the part we need, i.e. const { Client } = require('discord.js');, which loads in the Client module only.

//#endregion

//#region Data Files

//Data files are stored in the ./data folder, and should all be .json files containing information that is needed to run the bot in some way

//#endregion

//#region Helpers

//Helpers are stored in the ./helper folder, and they are functions that will be used across several commands, or that might be useful across multiple commands
//When making a helper function make sure to use JDoc to describe what it does, i.e.

/**
 * This function takes several inputs and creates an embed message and then sends it in a server.
 * @param {Message} message - A Discord.js Message Object 
 * @returns {String} Username of person that sent message
 */
//function returnUser(message) {}


//#endregion

//#region Internals

//Internals are the core of the bot, rarely used in a command, often used in the main file.

//#endregion

//#region This exports the ??? command with the information about it
module.exports = {
    name: "", //string with the name of the command, this will be used as the primary call to the command
    type: [], //array of strings containing the ways the command can be used, 'Guild' for servers, 'DM' for DMs
    aliases: [""], //array of strings for alternate triggers for the command
    coolDown: 0, //cool down between the same user being able to run the command, in seconds
    class: '', //string classifying the command as part of a group, 'admin' for commands intended for admins, 'help' information related to the bot commands, 'fun' commands that are for general fun, server no clear purpose, 'direct' commands that have to do the bot direct messaging people, 'gaming' commands related to video games, and 'music' for commands that have to do with the music player feature of the bot
    usage: '', //string describing how to use the command, i.e. 'addmod ***MENTION-USERS***'
    description: "", //string describing what the command does
    execute(message, args, client, distube) {} //the code for the function goes in here, message is a discord.js message object, args are the split off arguments for a command, client is a discord.js client object
}
//#endregion