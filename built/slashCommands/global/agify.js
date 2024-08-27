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
var SlashCommandBuilder = require('discord.js').SlashCommandBuilder;
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
//#endregion
//#region Helpers
var _a = require('../../helpers/embedSlashMessages.js'), errorCustom = _a.errorCustom, warnCustom = _a.warnCustom, embedCustom = _a.embedCustom;
//#endregion
//#region This exports the agify command with the information about it
module.exports = {
    data: new SlashCommandBuilder()
        .setName('agify')
        .setDescription("Estimates someone's age based off of their name.")
        .addStringOption(function (option) {
        return option
            .setName('name')
            .setDescription("The person's name you want to agify")
            .setRequired(true);
    }),
    execute: function (client, interaction, distube) {
        return __awaiter(this, void 0, void 0, function () {
            var request, userInput;
            return __generator(this, function (_a) {
                request = new XMLHttpRequest();
                userInput = interaction.options.getString('name').toLowerCase();
                if (userInput == undefined) {
                    return [2 /*return*/, warnCustom(interaction, 'No user input detected, are you sure you put a name?', module.name)];
                }
                request.open('GET', 'https://api.agify.io/?name=' + userInput, true);
                request.onload = function () {
                    // Begin accessing JSON data here
                    var data = JSON.parse(request.responseText);
                    if (request.status >= 200 && request.status < 400) {
                        // Capitalizing the first letter of the returned name
                        var capitalizedName = userInput.charAt(0).toUpperCase() + userInput.slice(1);
                        embedCustom(interaction, 'Agify', '#5D3FD3', '\n The age of ' +
                            capitalizedName +
                            ' is estimated at ' +
                            data.age +
                            '.', {
                            text: "Requested by ".concat(interaction.user.username),
                            iconURL: null,
                        }, null, [], null, null);
                    }
                    else {
                        errorCustom(interaction, 'The Agify API was unable to be reached at this time. \n Try again later.', module.name, client);
                    }
                };
                request.send();
                return [2 /*return*/];
            });
        });
    },
};
//#endregion
