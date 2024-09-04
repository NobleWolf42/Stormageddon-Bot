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
    execute(message: MessageWithDeleted, args: string[], client: Client, distube?: DisTube, collections?: ExtraCollections, serverConfig?: ServerConfig): void | Promise<void>;
}
//#endregion

//#region exports
export { Command };
//#endregion
