//#region Dependencies
import { Client } from 'discord.js';
import { DisTube } from 'distube';
import { MessageWithDeleted } from './messages.js';
import { ServerConfig } from './serverConfigModel.js';
import { ExtraCollections } from './extraCollectionsModel.js';
//#endregion

//#region Command interface
interface Command {
    name: string;
    type: string[];
    aliases: string[];
    coolDown: number;
    class: string;
    usage: string;
    description: string;
    /**
     * This is where each command's code lives
     * @param message - a message element (see MessageWithDeleted)
     * @param args - Array of string arguments passed in from discord message, contains capitals
     * @param client - Discord.JS Client
     * @param distube - DisTube Client
     * @param collections - ExtraCollections needed for some commands
     * @param serverConfig - serverConfig pulled and the start of each command for the guild it is run in
     */
    execute(message: MessageWithDeleted, args: string[], client: Client, distube?: DisTube, collections?: ExtraCollections, serverConfig?: ServerConfig): void | Promise<void>;
}
//#endregion

//#region exports
export { Command };
//#endregion
