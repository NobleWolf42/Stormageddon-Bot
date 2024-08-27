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
//#region Dependencies
var _a = require('discord.js'), SlashCommandBuilder = _a.SlashCommandBuilder, PermissionFlagsBits = _a.PermissionFlagsBits;
//#endregion
//#region Helpers
var updateConfigFile = require('../../helpers/currentSettings.js').updateConfigFile;
var _b = require('../../helpers/embedSlashMessages.js'), errorNoServerAdmin = _b.errorNoServerAdmin, errorCustom = _b.errorCustom, warnCustom = _b.warnCustom, embedCustom = _b.embedCustom;
//##endregion
//#region Internals
var buildConfigFile = require('../../internal/settingsFunctions.js').buildConfigFile;
//#endregion
//#region This exports the mod command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mod')
        .setDescription('Modify the modmail mod list. MUST HAVE SERVER ADMINISTRATOR STATUS.')
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('add')
            .setDescription('Adds user to the list.')
            .addUserOption(function (option) {
            return option
                .setName('moderator')
                .setDescription('The member to add to modlist')
                .setRequired(true);
        });
    })
        .addSubcommand(function (subcommand) {
        return subcommand
            .setName('remove')
            .setDescription('Removes user from list')
            .addUserOption(function (option) {
            return option
                .setName('moderator')
                .setDescription('The member to add to modlist')
                .setRequired(true);
        });
    })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var serverConfig, user, serverID, array, userFound, modMail, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serverConfig = updateConfigFile();
                        if (!(interaction.guild.id in serverConfig)) return [3 /*break*/, 6];
                        if (interaction.options.size == 0) {
                            return [2 /*return*/, warnCustom(interaction, 'No user input detected!', module.name, client)];
                        }
                        user = interaction.options.getUser('moderator');
                        serverID = interaction.guildId;
                        array = serverConfig[serverID].modMail.modList;
                        userFound = false;
                        modMail = {};
                        array.forEach(function (item) {
                            if (item == user) {
                                userFound = true;
                            }
                        });
                        _a = interaction.options.getSubcommand();
                        switch (_a) {
                            case 'add': return [3 /*break*/, 1];
                            case 'remove': return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1:
                        if (!userFound) {
                            array.push(user.id);
                        }
                        else {
                            return [2 /*return*/, warnCustom(interaction, "User ".concat(user.tag, " is already a Mod!"), module.name, client)];
                        }
                        modMail.modList = array;
                        modMail.enable = true;
                        serverConfig[serverID].modMail = modMail;
                        return [4 /*yield*/, buildConfigFile(serverConfig)];
                    case 2:
                        _b.sent();
                        embedCustom(interaction, 'Mod Added', '#5D3FD3', "Mod has been successfully added!", {
                            text: "Requested by ".concat(interaction.user.username),
                            iconURL: null,
                        }, null, [], null, null);
                        serverConfig = updateConfigFile();
                        return [3 /*break*/, 5];
                    case 3:
                        if (userFound) {
                            array = array.filter(function (value) {
                                return value != user.id;
                            });
                        }
                        else {
                            return [2 /*return*/, warnCustom(interaction, "User ".concat(user.tag, " is not a Mod!"), module.name, client)];
                        }
                        modMail.modList = array;
                        modMail.enable = true;
                        serverConfig[serverID].modMail = modMail;
                        return [4 /*yield*/, buildConfigFile(serverConfig)];
                    case 4:
                        _b.sent();
                        embedCustom(interaction, 'Mod Removed', '#5D3FD3', "Mod has been successfully removed!", {
                            text: "Requested by ".concat(interaction.user.username),
                            iconURL: null,
                        }, null, [], null, null);
                        serverConfig = updateConfigFile();
                        return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, errorCustom(interaction, 'Server is not set up with the bot yet!', module.name, client)];
                    case 7: return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion
