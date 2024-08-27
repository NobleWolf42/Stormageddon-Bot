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
var _a = require('discord.js'), SlashCommandBuilder = _a.SlashCommandBuilder, EmbedBuilder = _a.EmbedBuilder;
//#endregion
//#region Helpers
var embedCustom = require('../../helpers/embedSlashMessages.js').embedCustom;
//#endregion
//#region This exports the bugreport command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Send a bug report to the developers.')
        .addStringOption(function (option) {
        return option
            .setName('bugreport')
            .setDescription('Description of the bug encountered, if you got an error message it was auto-reported.')
            .setRequired(true);
    }),
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var content, devList, _a, _b, _c, _i, dev, embMsg;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        content = interaction.options.getString('bugreport');
                        devList = process.env.devIDs;
                        _a = devList;
                        _b = [];
                        for (_c in _a)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 5];
                        _c = _b[_i];
                        if (!(_c in _a)) return [3 /*break*/, 4];
                        key = _c;
                        return [4 /*yield*/, client.users.fetch(devList[key])];
                    case 2:
                        dev = _d.sent();
                        embMsg = new EmbedBuilder()
                            .setTitle('Bug Report')
                            .setColor('#F8AA2A')
                            .setDescription(content)
                            .setFooter({
                            text: "From - ".concat(interaction.user.username, "."),
                            iconURL: null,
                        })
                            .setTimestamp();
                        return [4 /*yield*/, dev.send({ embeds: [embMsg] })];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, embedCustom(interaction, 'Bug Report Sent.', '#0B6E29', "**Bug Report:** `".concat(content, "` \n**Sent To:** `\uD83D\uDC3A The Developers \uD83D\uDC3A`"), {
                            text: "Requested by ".concat(interaction.user.username),
                            iconURL: null,
                        }, null, [], null, null)];
                }
            });
        });
    },
};
//#endregion
