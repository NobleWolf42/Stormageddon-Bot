//#region Imports
import { SlashCommand } from '../../models/slashCommandModel.js';
import agifySlashCommand from './agify.js';
import bugReportSlashCommand from './bugreport.js';
import destiny2SlashCommand from './destiny2.js';
import helpSlashCommand from './help.js';
import infoSlashCommand from './info.js';
import issSlashCommand from './iss.js';
//#endregion

//#region Global Slash Command Array
const activeGlobalSlashCommands: SlashCommand[] = [agifySlashCommand, bugReportSlashCommand, destiny2SlashCommand, helpSlashCommand, infoSlashCommand, issSlashCommand];
//#endregion

//#region Exports
export { activeGlobalSlashCommands };
//#endregion
