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
//#region Helpers
var _a = require('../helpers/embedMessages.js'), embedCustom = _a.embedCustom, warnDisabled = _a.warnDisabled, errorCustom = _a.errorCustom, warnCustom = _a.warnCustom, errorNoAdmin = _a.errorNoAdmin;
var adminCheck = require('../helpers/userPermissions.js').adminCheck;
//#endregion
//#region Internals
var _b = require('../internal/settingsFunctions.js'), addRemoveBlame = _b.addRemoveBlame, changeBlameOffset = _b.changeBlameOffset;
//#endregion
//#region This exports the blame command with the information about it
module.exports = {
    name: 'blame',
    type: ['Guild'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: 'blame ""/add/remove/addperm/removeperm/list/fix ***FOR-ADD/REMOVE/ADDPERM/REMOVEPERM-ONLY-TYPE-NAME-HERE***/***FIX-ONLY-NUMBER-IN-LIST-OF-PERSON***',
    description: 'Blames someone based on a weekly rotation. Can also add someone to a permanent blame list. Add/Remove/AddPerm/RemovePerm/List are Admin ONLY Commands.',
    execute: function (message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var serverID, serverConfig, erroredOut, adminTF, oldSubCommand, _a, argsString, argsString, argsString, argsString, rBlameString, pBlameString, currentVal, wantedVal, offset, blameList, blameString, rotateIndex;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        serverID = message.guild.id;
                        return [4 /*yield*/, MongooseServerConfig.findById(serverID).exec()];
                    case 1:
                        serverConfig = _b.sent();
                        erroredOut = false;
                        adminTF = adminCheck(message);
                        oldSubCommand = " ".concat(args[0]);
                        if (!serverConfig.blame.enable) return [3 /*break*/, 17];
                        _a = args[0];
                        switch (_a) {
                            case 'add': return [3 /*break*/, 2];
                            case 'addperm': return [3 /*break*/, 4];
                            case 'remove': return [3 /*break*/, 6];
                            case 'removeperm': return [3 /*break*/, 8];
                            case 'list': return [3 /*break*/, 10];
                            case 'fix': return [3 /*break*/, 11];
                        }
                        return [3 /*break*/, 15];
                    case 2:
                        if (!adminTF) {
                            errorNoAdmin(message, module.name + oldSubCommand);
                        }
                        args = args.splice(1);
                        argsString = args.join(' ');
                        return [4 /*yield*/, addRemoveBlame(serverID, true, false, argsString).catch(function (err) {
                                if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                                    warnCustom(message, err.message, 'blame' + oldSubCommand);
                                }
                                else {
                                    errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                                }
                                erroredOut = true;
                                return serverConfig;
                            })];
                    case 3:
                        serverConfig = _b.sent();
                        if (!erroredOut) {
                            embedCustom(message, 'Success', '#00FF00', "Successfully added ".concat(argsString, " to the rotating blame list."), {
                                text: "Requested by ".concat(message.author.tag),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 16];
                    case 4:
                        if (!adminTF) {
                            errorNoAdmin(message, module.name + oldSubCommand);
                        }
                        args = args.splice(1);
                        argsString = args.join(' ');
                        return [4 /*yield*/, addRemoveBlame(serverID, true, true, argsString).catch(function (err) {
                                if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                                    warnCustom(message, err.message, 'blame' + oldSubCommand);
                                }
                                else {
                                    errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                                }
                                erroredOut = true;
                                return serverConfig;
                            })];
                    case 5:
                        serverConfig = _b.sent();
                        if (!erroredOut) {
                            embedCustom(message, 'Success', '#00FF00', "Successfully added ".concat(argsString, " to the rotating blame list."), {
                                text: "Requested by ".concat(message.author.tag),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 16];
                    case 6:
                        if (!adminTF) {
                            errorNoAdmin(message, module.name + oldSubCommand);
                        }
                        args = args.splice(1);
                        argsString = args.join(' ');
                        return [4 /*yield*/, addRemoveBlame(serverID, false, false, argsString).catch(function (err) {
                                if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                                    warnCustom(message, err.message, 'blame' + oldSubCommand);
                                }
                                else {
                                    errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                                }
                                erroredOut = true;
                                return serverConfig;
                            })];
                    case 7:
                        serverConfig = _b.sent();
                        if (!erroredOut) {
                            embedCustom(message, 'Success', '#00FF00', "Successfully removed ".concat(argsString, " to the rotating blame list."), {
                                text: "Requested by ".concat(message.author.tag),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 16];
                    case 8:
                        if (!adminTF) {
                            errorNoAdmin(message, module.name + oldSubCommand);
                        }
                        args = args.splice(1);
                        argsString = args.join(' ');
                        return [4 /*yield*/, addRemoveBlame(serverID, false, true, argsString).catch(function (err) {
                                if (err.name == 'PersonExists' || err.name == 'PersonNotExists') {
                                    warnCustom(message, err.message, 'blame' + oldSubCommand);
                                }
                                else {
                                    errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                                }
                                erroredOut = true;
                                return serverConfig;
                            })];
                    case 9:
                        serverConfig = _b.sent();
                        if (!erroredOut) {
                            embedCustom(message, 'Success', '#00FF00', "Successfully removed ".concat(argsString, " to the rotating blame list."), {
                                text: "Requested by ".concat(message.author.tag),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 16];
                    case 10:
                        rBlameString = '';
                        pBlameString = '';
                        if (!adminTF) {
                            errorNoAdmin(message, module.name + oldSubCommand);
                        }
                        for (key in serverConfig.blame.permList) {
                            if (key == serverConfig.blame.permList.length - 1) {
                                pBlameString += "".concat(serverConfig.blame.permList[key]);
                            }
                            else {
                                pBlameString += "".concat(serverConfig.blame.permList[key], ", ");
                            }
                        }
                        for (key in serverConfig.blame.rotateList) {
                            if (key == serverConfig.blame.rotateList.length - 1) {
                                rBlameString += "".concat(serverConfig.blame.rotateList[key]);
                            }
                            else {
                                rBlameString += "".concat(serverConfig.blame.rotateList[key], ", ");
                            }
                        }
                        embedCustom(message, 'Blame List:', '#B54A65', "Rotating Blame List: ".concat(rBlameString, "\nPermanent Blame List: ").concat(pBlameString), {
                            text: "Requested by ".concat(message.author.tag),
                            iconURL: null,
                        }, null, [], null, null);
                        return [3 /*break*/, 16];
                    case 11:
                        currentVal = Math.floor((Date.now() - 493200000) / 604800000) -
                            Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) *
                                serverConfig.blame.rotateList.length;
                        if (args[1] == undefined || args[1] < 1 || args[1] > serverConfig.blame.rotateList) {
                            return [2 /*return*/, warnCustom(message, "You must put a number between 1 and ".concat(serverConfig.blame.rotateList.length), module.name)];
                        }
                        wantedVal = args[1] - 1;
                        if (!(currentVal != wantedVal)) return [3 /*break*/, 13];
                        offset = currentVal - wantedVal;
                        return [4 /*yield*/, changeBlameOffset(serverID, offset).catch(function (err) {
                                errorCustom(message, err.message, 'blame' + oldSubCommand, client);
                                erroredOut = true;
                                return serverConfig;
                            })];
                    case 12:
                        serverConfig = _b.sent();
                        if (!erroredOut) {
                            embedCustom(message, 'Success', '#00FF00', "Successfully changed ".concat(serverConfig.blame.rotateList[wantedVal], " to the current one to blame."), {
                                text: "Requested by ".concat(message.author.tag),
                                iconURL: null,
                            }, null, [], null, null);
                        }
                        return [3 /*break*/, 14];
                    case 13:
                        warnCustom(message, "It is already that user's week!", module.name);
                        _b.label = 14;
                    case 14: return [3 /*break*/, 16];
                    case 15:
                        blameList = [];
                        for (key in serverConfig.blame.permList) {
                            blameList.push(serverConfig.blame.permList[key]);
                        }
                        blameString = '';
                        if (serverConfig.blame.rotateList.length > 0) {
                            rotateIndex = Math.floor((Date.now() - 493200000) / 604800000) -
                                Math.floor(Math.floor((Date.now() - 493200000) / 604800000) / serverConfig.blame.rotateList.length) *
                                    serverConfig.blame.rotateList.length -
                                serverConfig.blame.offset;
                            if (rotateIndex >= serverConfig.blame.rotateList.length) {
                                rotateIndex -= serverConfig.blame.rotateList.length;
                            }
                            else if (rotateIndex < 0) {
                                rotateIndex += serverConfig.blame.rotateList.length;
                            }
                            blameList.push(serverConfig.blame.rotateList[rotateIndex]);
                        }
                        else if (blameList.length < 1) {
                            return [2 /*return*/, warnCustom(message, 'The blame list is empty!', module.name)];
                        }
                        if (blameList.length == 1) {
                            if (serverConfig.blame.cursing) {
                                embedCustom(message, 'Blame', '#B54A65', "It's ".concat(blameList[0], "'s fault fuck that guy in particular!"), {
                                    text: "Requested by ".concat(message.author.tag),
                                    iconURL: null,
                                }, null, [], null, null);
                            }
                            else {
                                embedCustom(message, 'Blame', '#B54A65', "It's ".concat(blameList[0], "'s fault screw that guy in particular!"), {
                                    text: "Requested by ".concat(message.author.tag),
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
                            if (serverConfig.blame.cursing) {
                                embedCustom(message, 'Blame', '#B54A65', "It's ".concat(blameString, " fault fuck those guys in particular!"), {
                                    text: "Requested by ".concat(message.author.tag),
                                    iconURL: null,
                                }, null, [], null, null);
                            }
                            else {
                                embedCustom(message, 'Blame', '#B54A65', "It's ".concat(blameString, " fault screw those guys in particular!"), {
                                    text: "Requested by ".concat(message.author.tag),
                                    iconURL: null,
                                }, null, [], null, null);
                            }
                        }
                        return [3 /*break*/, 16];
                    case 16: return [3 /*break*/, 18];
                    case 17:
                        warnDisabled(message, 'blame', module.name);
                        _b.label = 18;
                    case 18: return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion
