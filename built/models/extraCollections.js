//#region Imports
import { Collection } from 'discord.js';
//#endregion
//#region Extra Collections
class ExtraCollections {
    constructor(commands = new Collection(), slashCommands = new Collection(), voiceGenerator = new Collection()) {
        this.commands = commands;
        this.slashCommands = slashCommands;
        this.voiceGenerator = voiceGenerator;
    }
}
//#endregion
//#region Exports
export { ExtraCollections };
//#endregion
