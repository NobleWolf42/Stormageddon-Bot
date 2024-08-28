//#region Helpers
const { errorNoAdmin, warnCustom, embedCustom, errorCustom } = require('../helpers/embedMessages.js');
const { adminCheck } = require('../helpers/userPermissions.js');
//#endregion

//#region Models
import { MongooseServerConfig } from '../models/serverConfig.js';
//#endregion

//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
const isSymbol = /[~!$%^&*()_+\-={}[\]\|:";'<>?,.]/;

//#region This exports the changeprefix command with the information about it
module.exports = {
    name: 'changeprefix',
    type: ['Guild'],
    aliases: [],
    coolDown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: 'Changes the prefix the bot uses in your server. Available Symbols: ```~!$%^&*()_+-=[];\',.{}|:"<>?```',
    async execute(message, args, client, distube) {
        var serverID = message.guild.id;
        var dbCall = await MongooseServerConfig.findById(serverID).exec();
        var serverConfig = dbCall[0];

        if (adminCheck(message)) {
            if (args[0] != undefined) {
                if (args[0].length == 1 && isSymbol.test(args[0])) {
                    serverConfig.prefix = args[0];

                    serverConfig.save();

                    return embedCustom(
                        message,
                        'Current Prefix:',
                        '#008000',
                        `Current Prefix is ${args[0]}`,
                        {
                            text: `Requested by ${message.author.tag}`,
                            iconURL: null,
                        },
                        null,
                        [],
                        null,
                        null
                    );
                } else {
                    return warnCustom(message, 'Bot Prefix Must be ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', module.name);
                }
            } else {
                return warnCustom(message, 'You must define a bot prefix.', module.name);
            }
        } else {
            return errorNoAdmin(message, module.name);
        }
    },
};
//#endregion
