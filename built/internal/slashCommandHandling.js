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
var discord_js_1 = require("discord.js");
var fs_1 = require("fs");
var path_1 = require("path");
//#endregion
//#region Helpers
var errorLog_1 = require("../helpers/errorLog");
//#endregion
//#region Slash Command Handler
function slashCommandHandling(client, distube) {
    return __awaiter(this, void 0, void 0, function () {
        var foldersPath, commandFolders, _i, commandFolders_1, folder, commandsPath, commandFiles, _a, commandFiles_1, file, filePath, command;
        var _this = this;
        return __generator(this, function (_b) {
            client.slashCommands = new discord_js_1.Collection();
            foldersPath = (0, path_1.join)(__dirname, '../slashCommands');
            commandFolders = (0, fs_1.readdirSync)(foldersPath);
            for (_i = 0, commandFolders_1 = commandFolders; _i < commandFolders_1.length; _i++) {
                folder = commandFolders_1[_i];
                commandsPath = (0, path_1.join)(foldersPath, folder);
                commandFiles = (0, fs_1.readdirSync)(commandsPath).filter(function (file) { return file.endsWith('.js'); });
                for (_a = 0, commandFiles_1 = commandFiles; _a < commandFiles_1.length; _a++) {
                    file = commandFiles_1[_a];
                    filePath = (0, path_1.join)(commandsPath, file);
                    command = require(filePath);
                    // Set a new item in the Collection with the key as the command name and the value as the exported module
                    if ('data' in command && 'execute' in command) {
                        client.slashCommands.set(command.data.name, command);
                    }
                    else {
                        console.log("[WARNING] The command at ".concat(filePath, " is missing a required \"data\" or \"execute\" property."));
                    }
                }
            }
            client.on('interactionCreate', function (interaction) { return __awaiter(_this, void 0, void 0, function () {
                var command, error_1, guild, channel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!interaction.isChatInputCommand()) {
                                return [2 /*return*/];
                            }
                            command = interaction.client.slashCommands.get(interaction.commandName);
                            if (!command) {
                                console.error("No command matching ".concat(interaction.commandName, " was found."));
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 9]);
                            return [4 /*yield*/, command.execute(client, interaction, distube)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 9];
                        case 3:
                            error_1 = _a.sent();
                            console.error(error_1);
                            guild = null;
                            if (interaction.guildId) {
                                guild = interaction.guild.name;
                            }
                            return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                        case 4:
                            channel = _a.sent();
                            (0, errorLog_1.addToLog)('fatal error', command.data.name, interaction.user.username, guild, channel.name, error_1, client);
                            if (!(interaction.replied || interaction.deferred)) return [3 /*break*/, 6];
                            return [4 /*yield*/, interaction.followUp({
                                    content: 'There was an error while executing this command!',
                                    ephemeral: true,
                                })];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, interaction.reply({
                                content: 'There was an error while executing this command!',
                                ephemeral: true,
                            })];
                        case 7:
                            _a.sent();
                            _a.label = 8;
                        case 8: return [3 /*break*/, 9];
                        case 9: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
//#endregion
//#region Registers Guild Slash Commands with discord
function registerGuildSlashCommands(guildId) {
    return __awaiter(this, void 0, void 0, function () {
        var commands, commandFiles, _i, commandFiles_2, file, command, rest;
        var _this = this;
        return __generator(this, function (_a) {
            commands = [];
            commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, '../slashCommands/guild')).filter(function (file) { return file.endsWith('.js'); });
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (_i = 0, commandFiles_2 = commandFiles; _i < commandFiles_2.length; _i++) {
                file = commandFiles_2[_i];
                command = require((0, path_1.join)(__dirname, '../slashCommands/guild', "".concat(file)));
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
                else {
                    console.log("[WARNING] The command at ../slashCommands/guild/".concat(file, " is missing a required \"data\" or \"execute\" property."));
                }
            }
            rest = new discord_js_1.REST().setToken(process.env.authToken);
            // and deploy your commands!
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var data, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log("Started refreshing ".concat(commands.length, " guild (/) commands."));
                            return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationGuildCommands(process.env.clientID, guildId), { body: commands })];
                        case 1:
                            data = _a.sent();
                            console.log("Successfully reloaded ".concat(data.length, " application (/) commands."));
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            // And of course, make sure you catch and log any errors!
                            console.error(error_2);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/];
        });
    });
}
//#endregion
//#region Registers Global Slash Commands with discord
function registerGlobalSlashCommands() {
    return __awaiter(this, void 0, void 0, function () {
        var commands, commandFiles, _i, commandFiles_3, file, command, rest;
        var _this = this;
        return __generator(this, function (_a) {
            commands = [];
            commandFiles = (0, fs_1.readdirSync)((0, path_1.join)(__dirname, '../slashCommands/global')).filter(function (file) { return file.endsWith('.js'); });
            // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
            for (_i = 0, commandFiles_3 = commandFiles; _i < commandFiles_3.length; _i++) {
                file = commandFiles_3[_i];
                command = require((0, path_1.join)(__dirname, '../slashCommands/global', "".concat(file)));
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                }
                else {
                    console.log("[WARNING] The command at ../slashCommands/global/".concat(file, " is missing a required \"data\" or \"execute\" property."));
                }
            }
            rest = new discord_js_1.REST().setToken(process.env.authToken);
            // and deploy your commands!
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var data, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            console.log("Started refreshing ".concat(commands.length, " application (/) commands."));
                            return [4 /*yield*/, rest.put(discord_js_1.Routes.applicationCommands(process.env.clientID), { body: commands })];
                        case 1:
                            data = _a.sent();
                            console.log("Successfully reloaded ".concat(data.length, " application (/) commands."));
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            // And of course, make sure you catch and log any errors!
                            console.error(error_3);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
            return [2 /*return*/];
        });
    });
}
//#endregion
//#region exports
module.exports = {
    slashCommandHandling: slashCommandHandling,
    registerGuildSlashCommands: registerGuildSlashCommands,
    registerGlobalSlashCommands: registerGlobalSlashCommands,
};
//#endregion
