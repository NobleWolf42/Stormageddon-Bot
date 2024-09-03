//#region Imports
import { Collection } from 'discord.js';
import { Command } from './commandModel.js';
import { SlashCommand } from './slashCommandModel.js';
//#endregion

//#region Extra Collections
class ExtraCollections {
    commands: Collection<string, Command>;
    slashCommands: Collection<string, SlashCommand>;
    voiceGenerator: Collection<string, string>;

    constructor(
        commands: Collection<string, Command> = new Collection(),
        slashCommands: Collection<string, SlashCommand> = new Collection(),
        voiceGenerator: Collection<string, string> = new Collection()
    ) {
        this.commands = commands;
        this.slashCommands = slashCommands;
        this.voiceGenerator = voiceGenerator;
    }
}
//#endregion

//#region Exports
export { ExtraCollections };
//#endregion
