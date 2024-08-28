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
var Collection = require('discord.js').Collection;
var _a = require('fs'), readdirSync = _a.readdirSync, readFileSync = _a.readFileSync;
var join = require('path').join;
//#endregion
//#region Helpers
var _b = require('../helpers/embedMessages.js'), warnCustom = _b.warnCustom, errorCustom = _b.errorCustom, embedCustom = _b.embedCustom;
var getRandomDoggo = require('../helpers/doggoLinks.js').getRandomDoggo;
var addToLog = require('../helpers/errorLog.js').addToLog;
//#endregion
//#region Modules
var serverConfig_1 = require("../models/serverConfig");
//#endregion
//Regex that tests for str (prefix)
var escapeRegex = function (str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
//#region Function for trying a command and catching the error if it fails
/**
 * This function tries a command and catches the error if it fails.
 * @param {Client} client - Discord.js Client Object
 * @param {Message} message - Discord.js Message Object
 * @param {string} command - String of command keyword
 * @param {Array} args - Array of the words after the command keyword
 */
function tryCommand(client, message, command, args, distube) {
    try {
        command.execute(message, args, client, distube);
        addToLog('Success', command.name, message.author.tag, message.guild.name, message.channel.name);
    }
    catch (error) {
        addToLog('Fatal Error', command.name, message.author.tag, message.guild.name, message.channel.name, error, client);
        errorCustom(message, 'There was an error executing that command.', command.name, client);
        console.log(error);
    }
}
//#endregion
//#region Function that starts the listener that handles executing all commands in servers
/**
 * This function starts the listener that handles executing all commands in a server.
 * @param {Client} client - Discord.js Client Object
 * @param {DisTube} distube - DisTube Client Object
 */
function messageHandling(client, distube) {
    var _this = this;
    client.commands = new Collection();
    var coolDowns = new Collection();
    //#region Imports commands from ./commands
    var commandFiles = readdirSync(join(__dirname, '../commands')).filter(function (file) { return file.endsWith('.js'); });
    for (var _i = 0, commandFiles_1 = commandFiles; _i < commandFiles_1.length; _i++) {
        var file = commandFiles_1[_i];
        var command = require(join(__dirname, '../commands', "".concat(file)));
        client.commands.set(command.name, command);
    }
    //#endregion
    //Handles messages from guilds and their responses
    client.on('messageCreate', function (message) { return __awaiter(_this, void 0, void 0, function () {
        var serverID, serverConfig, prefixRegex, _a, matchedPrefix, args, commandName, command, now, timestamps, coolDownAmount, expirationTime, timeLeft;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    //#region Checks permissions
                    // Make sure bots can't run commands
                    if (message.author.bot)
                        return [2 /*return*/];
                    // Make sure the commands can only be run in a server
                    if (!message.guild)
                        return [2 /*return*/];
                    serverID = message.channel.guild.id;
                    return [4 /*yield*/, serverConfig_1.MongooseServerConfig.findById(serverID).exec()];
                case 1:
                    serverConfig = _b.sent();
                    message.prefix = serverConfig.prefix;
                    //#endregion
                    //#region Handles all @ Commands
                    if (message.mentions.users.first() !== undefined) {
                        //@bot
                        if (message.mentions.users.first().id === client.user.id) {
                            if (serverConfig.setupNeeded) {
                                return [2 /*return*/, embedCustom(message, "".concat(client.user.tag), '#5D3FD3', "Please run `".concat(prefix, "setup` in an admin only chat channel to set up the bot on your server."), {
                                        text: "Requested by ".concat(message.author.tag),
                                        iconURL: null,
                                    }, getRandomDoggo(), [], null, null)];
                            }
                            else {
                                return [2 /*return*/, embedCustom(message, "".concat(client.user.tag), '#5D3FD3', "Woof Woof, My Prefix is `".concat(prefix, "`, for more commands, please use the `").concat(prefix, "help` command."), {
                                        text: "Requested by ".concat(message.author.tag),
                                        iconURL: null,
                                    }, getRandomDoggo(), [], null, null)];
                            }
                        }
                    }
                    //#endregion
                    //#region honse responder
                    if (message.content.toLowerCase().includes('honse')) {
                        message.channel.send('https://i.imgur.com/hKZb0pc.png');
                    }
                    prefixRegex = new RegExp("^(<@!?".concat(client.user.id, ">|").concat(escapeRegex(prefix), ")\\s*"));
                    if (!prefixRegex.test(message.content))
                        return [2 /*return*/];
                    _a = message.content.match(prefixRegex), matchedPrefix = _a[1];
                    args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
                    commandName = args.shift().toLowerCase();
                    command = client.commands.get(commandName) || client.commands.find(function (cmd) { return cmd.aliases && cmd.aliases.includes(commandName); });
                    if (!command)
                        return [2 /*return*/];
                    if (!command.type.includes('Guild'))
                        return [2 /*return*/];
                    //#endregion
                    //#region Anti-Spam (CoolDown) Code
                    //Checks to see if command has a coolDown set and if it does executes the code to prevent overuse of command
                    if (!coolDowns.has(command.name)) {
                        coolDowns.set(command.name, new Collection());
                    }
                    now = Date.now();
                    timestamps = coolDowns.get(command.name);
                    coolDownAmount = (command.coolDown || 1) * 1000;
                    if (timestamps.has(message.author.id)) {
                        expirationTime = timestamps.get(message.author.id) + coolDownAmount;
                        if (now < expirationTime) {
                            timeLeft = (expirationTime - now) / 1000;
                            return [2 /*return*/, warnCustom(message, "Please wait ".concat(timeLeft.toFixed(1), " more second(s) before reusing the `").concat(command.name, "` command."), command.name)];
                        }
                    }
                    timestamps.set(message.author.id, now);
                    setTimeout(function () { return timestamps.delete(message.author.id); }, coolDownAmount);
                    //#endregion
                    //#region Checks to see if server is set up
                    if (command.name == 'setup') {
                        tryCommand(client, message, command, args, distube);
                        return [2 /*return*/];
                    }
                    else if (serverConfig.setupNeeded) {
                        return [2 /*return*/, warnCustom(message, "You must set up the bot on this server before you can use commands. You can do this by using the `".concat(prefix, "setup` command in an Admin Only chat."), command.name)];
                    }
                    //#endregion
                    tryCommand(client, message, command, args, distube);
                    return [2 /*return*/];
            }
        });
    }); });
}
//#endregion
//#region Function that starts the listener that handles executing all commands in DMs
/**
 * This function starts the listener that handles executing all commands in DMs.
 * @param {Client} client - Discord.js Client Object
 * @param {DisTube} distube - DisTube Client Object
 */
function PMHandling(client, distube) {
    client.on('messageCreate', function (message) {
        var prefix = '!';
        var coolDowns = new Collection();
        //#region Check permissions
        // Make sure the command can only be run in a PM
        if (message.guild)
            return;
        // Make sure bots can't run this command
        if (message.author.bot)
            return;
        //#endregion
        //#region Handles all @ Commands
        if (message.mentions.users.first() !== undefined) {
            //@bot
            if (message.mentions.users.first().id === client.user.id) {
                return embedCustom(message, "".concat(client.user.tag), '#5D3FD3', "Woof Woof, My Prefix is `".concat(prefix, "`, for more commands, please use the `").concat(prefix, "help` command."), {
                    text: "Requested by ".concat(message.author.tag),
                    iconURL: null,
                }, getRandomDoggo(), [], null, null);
            }
        }
        //#endregion
        //#region Handles DM commands
        //#region Prefix and Command Validation
        //Escapes if message does not start with prefix
        var prefixRegex = new RegExp("^(<@?".concat(client.user.id, ">|").concat(escapeRegex(prefix), ")\\s*"));
        if (!prefixRegex.test(message.content))
            return;
        //Gets command name as typed by user
        var _a = message.content.match(prefixRegex), matchedPrefix = _a[1];
        var args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        var commandName = args.shift().toLowerCase();
        //Checks to see if it is a valid command and ignores message if it is not
        var command = client.commands.get(commandName) || client.commands.find(function (cmd) { return cmd.aliases && cmd.aliases.includes(commandName); });
        if (!command)
            return;
        if (!command.type.includes('DM'))
            return;
        //#endregion
        //#region Anti-Spam (CoolDown) Code
        //Checks to see if command has a coolDown set and if it does executes the code to prevent overuse of command
        if (!coolDowns.has(command.name)) {
            coolDowns.set(command.name, new Collection());
        }
        var now = Date.now();
        var timestamps = coolDowns.get(command.name);
        var coolDownAmount = (command.coolDown || 1) * 1000;
        if (timestamps.has(message.author.id)) {
            var expirationTime = timestamps.get(message.author.id) + coolDownAmount;
            if (now < expirationTime) {
                var timeLeft = (expirationTime - now) / 1000;
                return warnCustom(message, "Please wait ".concat(timeLeft.toFixed(1), " more second(s) before reusing the `").concat(command.name, "` command."), command.name);
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(function () { return timestamps.delete(message.author.id); }, coolDownAmount);
        //#endregion
        try {
            command.execute(message, args, client, distube);
            addToLog('Success', command.name, message.author.tag, 'DM', 'Private Message');
        }
        catch (error) {
            addToLog('Fatal Error', command.name, message.author.tag, 'DM', 'Private Message', error, client);
            errorCustom(message, 'There was an error executing that command.', command.name, client);
            console.log(error);
        }
        //#endregion
    });
}
//#endregion
//#region exports
module.exports = { messageHandling: messageHandling, PMHandling: PMHandling };
//#endregion
