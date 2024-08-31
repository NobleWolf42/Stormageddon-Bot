//#region Imports
import { errorNoAdmin, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { MongooseServerConfig } from '../models/serverConfig.js';
//#endregion

//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
const isSymbol = /[~!$%^&*()_+\-={}[\]\|:";'<>?,.]/;

//#region This exports the changeprefix command with the information about it
const changePrefixCommand = {
    name: 'changeprefix',
    type: ['Guild'],
    aliases: [],
    coolDown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: 'Changes the prefix the bot uses in your server. Available Symbols: ```~!$%^&*()_+-=[];\',.{}|:"<>?```',
    async execute(message, args, client, distube) {
        var serverID = message.guild.id;
        var serverConfig = await MongooseServerConfig.findById(serverID).exec();

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
                    warnCustom(message, 'Bot Prefix Must be ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', this.name);
                    return;
                }
            } else {
                warnCustom(message, 'You must define a bot prefix.', this.name);
                return;
            }
        } else {
            errorNoAdmin(message, this.name);
            return;
        }
    },
};
//#endregion

//#region Exports
export default changePrefixCommand;
//#endregion
