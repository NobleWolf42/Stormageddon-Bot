//#region Dependancies
const { readFileSync, writeFileSync} = require('fs');
const { errorNoAdmin, warnCustom, embedCustom } = require("../helpers/embedMessages.js");
const { adminCheck } = require('../helpers/userHandling.js');
const isSymbol = /[`~!$%^&*()_+\-={}[\]\|\\:";'<>?,.\/]/;

var prefixFile = JSON.parse(readFileSync('./data/botprefix.json'));
//#endregion

//#region Change Prefix Command
module.exports = {
    name: "changeprefix",
    type: ['Gulid'],
    aliases: [],
    cooldown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: "Changes the prefix the bot uses in your server. Available Symbols: ``~!$%^&*()_+-={}[]|\\:\";\\'<>?,.`",
    execute(message, args) {
        var serverID = message.channel.guild.id;

        if (adminCheck(message)) {
            if(args[0] != undefined) {
                if ((args[0].length == 1) && (isSymbol.test(args[0]))) {
                    prefixFile[serverID] = {"prefix": args[0]};

                    writeFileSync("./data/botprefix.json", JSON.stringify(prefixFile), (err) => {
                        if (err) {
                            console.error(err);
                        };
                    });

                    embedCustom(message, 'Current Prefix:', '#008000', `Current Prefix is ${args[0]}`);
                    return;
                }
                else {
                    warnCustom(message, 'Bot Prefix Must be one of the following: ````~!$%^&*()_+-={}[]|\:";\'<>?,./```');
                    return;
                }
            }
            else {
                warnCustom(message, 'You must define a bot prefix.');
                return;
            }
        }
        else {
            errorNoAdmin(message);
            return;
        }
    }
};
//#endregion