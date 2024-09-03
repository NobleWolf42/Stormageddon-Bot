//#region Imports
import { errorNoAdmin, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { buildConfigFile } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
import { MongooseServerConfig } from '../models/serverConfigModel.js';
//#endregion

//Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
const isSymbol = /[~!$%^&*()_+\-={}[\]\|:";'<>?,.]/;

//#region This exports the changeprefix command with the information about it
const changePrefixCommand: Command = {
    name: 'changeprefix',
    type: ['Guild'],
    aliases: [],
    coolDown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: 'Changes the prefix the bot uses in your server. Available Symbols: ```~!$%^&*()_+-=[];\',.{}|:"<>?```',
    async execute(message, args, client, distube) {
        var serverID = message.guild.id;
        var serverConfig = (await MongooseServerConfig.findById(serverID).exec()).toObject();

        if (adminCheck(message)) {
            if (args[0] != undefined) {
                if (args[0].length == 1 && isSymbol.test(args[0])) {
                    serverConfig.prefix = args[0];

                    buildConfigFile(serverConfig, serverID);

                    embedCustom(
                        message,
                        'Current Prefix:',
                        '#008000',
                        `Current Prefix is ${serverConfig.prefix}`,
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
                }
            } else {
                warnCustom(message, 'You must define a bot prefix.', this.name);
            }
        } else {
            errorNoAdmin(message, this.name);
        }
    },
};
//#endregion

//#region Exports
export default changePrefixCommand;
//#endregion
