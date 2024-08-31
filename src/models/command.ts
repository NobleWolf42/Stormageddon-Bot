//#region Dependencies
import { Message, Client } from 'discord.js';
import { DisTube } from 'distube';
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
    execute(message: Message, args: string[], client: Client, distube: DisTube): Promise<void>;
}
//#endregion

//#region exports
export { Command };
//#endregion
