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
var embedCustom = require('../helpers/embedMessages.js').embedCustom;
//#endregion
//#region This exports the info command with the information about it
module.exports = {
    name: 'info',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 60,
    class: 'help',
    usage: 'info',
    description: "Displays information about the bot, it's creators, and where you can go if you would like to contribute to it. (Works in Direct Messages too.)",
    execute: function (message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            return __generator(this, function (_o) {
                switch (_o.label) {
                    case 0:
                        _a = embedCustom;
                        _b = [message,
                            'Information',
                            '#200132'];
                        _h = (_g = "**Bot Name:** ".concat(client.user, "\n\n**Description:** All purpose bot, named after the worlds best Doggo, **")).concat;
                        return [4 /*yield*/, client.users.fetch('211865015592943616')];
                    case 1:
                        _j = (_f = _h.apply(_g, [_o.sent(), "'s** Stormageddon.\n\n**Designed and Built by:** *"])).concat;
                        return [4 /*yield*/, client.users.fetch('201665936049176576')];
                    case 2:
                        _k = (_e = _j.apply(_f, [_o.sent(), ", "])).concat;
                        return [4 /*yield*/, client.users.fetch('134900859560656896')];
                    case 3:
                        _l = (_d = _k.apply(_e, [_o.sent(), ", "])).concat;
                        return [4 /*yield*/, client.users.fetch('199716053729804288')];
                    case 4:
                        _m = (_c = _l.apply(_d, [_o.sent(), ", and "])).concat;
                        return [4 /*yield*/, client.users.fetch('207305619168952320')];
                    case 5: return [2 /*return*/, _a.apply(void 0, _b.concat([_m.apply(_c, [_o.sent(), "*\n\n**How To Help:** If you would like to assist with the bot, you can find us on [`Discord`](https://discord.gg/tgJtK7f) , and on [`GitHub`](https://github.com/NobleWolf42/Stormageddon-Bot/)."]), { text: "Requested by ".concat(message.author.tag), iconURL: null },
                            null,
                            [],
                            null,
                            null]))];
                }
            });
        });
    },
};
//#endregion
