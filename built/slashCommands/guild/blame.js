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
var _b = require('../../helpers/embedSlashMessages.js'), embedCustom = _b.embedCustom, warnDisabled = _b.warnDisabled, warnCustom = _b.warnCustom;
var updateConfigFile = require('../../helpers/currentSettings.js').updateConfigFile;
//#endregion
//#region This exports the blame command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('blame')
        .setDescription('Blames someone based on a weekly rotation/permanent blame list.'),
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var serverID, serverConfig, blameList, blameString, rotateIndex;
            return __generator(this, function (_a) {
                serverID = interaction.guildId;
                serverConfig = updateConfigFile();
                if (serverConfig[serverID].blame.enable) {
                    blameList = [];
                    for (key in serverConfig[serverID].blame.permList) {
                        blameList.push(serverConfig[serverID].blame.permList[key]);
                    }
                    blameString = '';
                    if (serverConfig[serverID].blame.rotateList.length > 0) {
                        rotateIndex = Math.floor((Date.now() - 493200000) / 604800000) -
                            Math.floor(Math.floor((Date.now() - 493200000) / 604800000) /
                                serverConfig[serverID].blame.rotateList.length) *
                                serverConfig[serverID].blame.rotateList.length -
                            serverConfig[serverID].blame.offset;
                        if (rotateIndex >=
                            serverConfig[serverID].blame.rotateList.length) {
                            rotateIndex -=
                                serverConfig[serverID].blame.rotateList.length;
                        }
                        else if (rotateIndex < 0) {
                            rotateIndex +=
                                serverConfig[serverID].blame.rotateList.length;
                        }
                        blameList.push(serverConfig[serverID].blame.rotateList[rotateIndex]);
                    }
                    else if (blameList.length < 1) {
                        return [2 /*return*/, warnCustom(interaction, 'The blame list is empty!', module.name, client)];
                    }
                    if (blameList.length == 1) {
                        if (serverConfig[serverID].blame.cursing) {
                            embedCustom(interaction, 'Blame', '#B54A65', "It's ".concat(blameList[0], "'s fault fuck that guy in particular!"), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        else {
                            embedCustom(interaction, 'Blame', '#B54A65', "It's ".concat(blameList[0], "'s fault screw that guy in particular!"), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                    }
                    else {
                        for (key in blameList) {
                            if (blameList.length > 2) {
                                if (key == blameList.length - 1) {
                                    blameString += "and ".concat(blameList[key], "'s");
                                }
                                else {
                                    blameString += "".concat(blameList[key], ", ");
                                }
                            }
                            else {
                                if (key == blameList.length - 1) {
                                    blameString += "and ".concat(blameList[key], "'s");
                                }
                                else {
                                    blameString += "".concat(blameList[key], " ");
                                }
                            }
                        }
                        if (serverConfig[serverID].blame.cursing) {
                            embedCustom(interaction, 'Blame', '#B54A65', "It's ".concat(blameString, " fault fuck those guys in particular!"), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        else {
                            embedCustom(interaction, 'Blame', '#B54A65', "It's ".concat(blameString, " fault screw those guys in particular!"), {
                                text: "Requested by ".concat(interaction.user.username),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                    }
                }
                else {
                    warnDisabled(interaction, 'blame', module.name, client);
                }
                return [2 /*return*/];
            });
        });
    },
};
//#endregion
