//#region Imports
import { errorNoAdmin, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { adminCheck } from '../helpers/userPermissions.js';
import { buildConfigFile } from '../internal/settingsFunctions.js';
import { Command } from '../models/commandModel.js';
//#endregion

//#region This creates the changeprefix command with the information about it
const changePrefixCommand: Command = {
    name: 'changeprefix',
    type: ['Guild'],
    aliases: [],
    coolDown: 3,
    class: 'admin',
    usage: 'changeprefix ***INSERT-SYMBOL***',
    description: 'Changes the prefix the bot uses in your server. Available Symbols: ```~!$%^&*()_+-=[];\',.{}|:"<>?```',
    async execute(message, args, _client, _distube, _collections, serverConfig) {
        //#region Escape Logic
        //Checks to see if user is bot admin
        if (!adminCheck(message.member, serverConfig)) {
            errorNoAdmin(message, this.name);
            return;
        }

        //Regex that should eliminate anything that is not ~!$%^&*()_+-={}[]|:";'<>?,.
        const isSymbol = /[~!$%^&*()_+\-={}[\]|:";'<>?,.]/;

        //Checks to see is the user input is correct
        if (args[0] == undefined || args[0].length != 1 || !isSymbol.test(args[0])) {
            warnCustom(message, 'You must pick ONE of the following: ```~!$%^&*()_+-={}[]|:";\'<>?,./```', this.name);
            return;
        }
        //#endregion

        //#region Main Logic - Takes user input and saves it to config as bot prefix
        serverConfig.prefix = args[0];

        buildConfigFile(serverConfig, message.guildId);

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
    },
};
//#endregion

//#region Exports
export default changePrefixCommand;
//#endregion
