//#region Imports
import { Command } from '../models/commandModel.js';
import { embedCustom, warnCustom, errorCustom } from '../helpers/embedMessages.js';
import { MessageWithDeleted } from '../models/messagesModel.js';
import { Client } from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { D2ClanData } from '../models/destiny2APIModels.js';
//#endregion

//#region This creates the destiny2 command with the information about it
const destiny2Command: Command = {
    name: 'destiny2',
    type: ['DM', 'Guild'],
    aliases: ['d2'],
    coolDown: 0,
    class: 'gaming',
    usage: 'destiny2 clan ***INSERT-CLAN-NAME***',
    description: "Displays Destiny 2 clan's bio, avatar, motto, and founder. (Works in Direct Messages too.)",
    async execute(message, args, client, _distube, _collections, serverConfig) {
        if (args[0] == 'clan') {
            const newArgs = args.splice(1);
            const clanName = newArgs.join(' ');

            getClan(message, clanName, this.name, client);
        } else {
            return warnCustom(message, `You did not use the command correctly, please try again (${serverConfig.prefix}destiny2 clan ***INSERT-CLAN-NAME***).`, this.name);
        }
    },
};
//#endregion

//#region Gets the information of the destiny 2 clan by name
function getClan(message: MessageWithDeleted, clan_name: string, name: string, client: Client) {
    // Request initialized and created
    axios.get('https://www.bungie.net/Platform/GroupV2/Name/' + clan_name + '/1', { headers: { 'X-API-KEY': process.env.d2ApiKey } }).then((request: AxiosResponse<D2ClanData>) => {
        if (request.status >= 200 && request.status < 400) {
            if (request.data != null && request.data != undefined) {
                const domain = 'https://www.bungie.net/';

                const attachment = domain + request.data.Response.founder.bungieNetUserInfo.iconPath;
                embedCustom(
                    message,
                    `${request.data.Response.detail.name} Clan Information`,
                    '#F5F5F5',
                    `The clan was created on <t:${Math.round(new Date(request.data.Response.detail.creationDate).getTime() / 1000)}>.\n The founder is ${request.data.Response.founder.destinyUserInfo.displayName}.\n \`${request.data.Response.detail.motto}\`\n\n Description: ${request.data.Response.detail.about}`,
                    {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    },
                    attachment,
                    [],
                    null,
                    null
                );
            } else {
                return warnCustom(message, `The Search for \`${request.data.Response.detail.name}\` returned no results.\n Try something else.`, name);
            }
        } else if (request.data.ErrorStatus == 'ClanNotFound') {
            return warnCustom(message, `The Search for \`${request.data.Response.detail.name}\` returned no results.\n Try something else.`, name);
        } else {
            return errorCustom(message, 'The Destiny API was unable to be reached at this time.\n Try again later.', name, client);
        }
    });
}
//#endregion

//#region Exports
export default destiny2Command;
//#endregion
