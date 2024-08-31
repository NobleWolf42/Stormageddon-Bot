//#region Imports
import { SlashCommand } from '../../models/slashCommand.js';
import agifySlashCommand from './agify.js';
//#endregion

//#region Global Slash Command Array
const activeGlobalSlashCommands: SlashCommand[] = [agifySlashCommand];
//#endregion

//#region Exports
export { activeGlobalSlashCommands };
//#endregion
