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
var _b = require('../../helpers/embedSlashMessages.js'), errorCustom = _b.errorCustom, embedCustom = _b.embedCustom, warnCustom = _b.warnCustom;
//#endregion
//#region This exports the clear command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Bulk deletes the previous messages in a chat, up to 99 previous messages.')
        .addNumberOption(function (option) {
        return option
            .setName('amount')
            .setDescription('The number of messages to delete (1-100).')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100);
    })
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, amount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, client.channels.fetch(interaction.channelId)];
                    case 1:
                        channel = _a.sent();
                        amount = parseInt(interaction.options.getInteger('amount'));
                        if (isNaN(amount)) {
                            return [2 /*return*/, warnCustom(interaction, "That is not a valid number for the clear command!", module.name, client)];
                        }
                        else if (amount < 1 || amount > 100) {
                            return [2 /*return*/, warnCustom(interaction, "".concat(args[0], " is an invalid number! __**Number must be between 1 and 100!**__"), module.name, client)];
                        }
                        else if (amount >= 1 && amount <= 100) {
                            channel
                                .bulkDelete(amount, true)
                                .then(function () {
                                return embedCustom(interaction, 'Success!', '#008000', "Successfully deleted ".concat(amount, " messages!"), {
                                    text: "Requested by ".concat(interaction.user.username),
                                    iconURL: null,
                                }, null, [], null, null);
                            })
                                .catch(function (err) {
                                if (err.message ==
                                    'You can only bulk delete messages that are under 14 days old.') {
                                    return warnCustom(interaction, "You can only bulk delete messages that are under 14 days old.", module.name, client);
                                }
                                else {
                                    return errorCustom(interaction, "An error occurred while attempting to delete! ".concat(err.message), module.name, client);
                                }
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
};
//#endregion