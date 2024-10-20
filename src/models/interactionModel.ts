//#region Imports
import { Interaction, AutocompleteInteraction } from 'discord.js';
//#endregion

//#region Interaction with changes - removes AutocompleteInteraction
type InteractionWithChanges = Exclude<Interaction, AutocompleteInteraction>;
//#endregion

//#region Exports
export { InteractionWithChanges };
//#endregion
