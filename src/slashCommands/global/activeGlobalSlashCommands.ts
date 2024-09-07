//#region Imports
import { SlashCommand } from '../../models/slashCommandModel.js';
import agifySlashCommand from './agify.js';
import bugReportSlashCommand from './bugReport.js';
import destiny2SlashCommand from './destiny2.js';
import helpSlashCommand from './help.js';
import infoSlashCommand from './info.js';
import issSlashCommand from './iss.js';
import modMailSlashCommand from './modMail.js';
import quoteSlashCommand from './quote.js';
//#endregion

//#region Global Slash Command Array
const activeGlobalSlashCommands: SlashCommand[] = [
    agifySlashCommand,
    bugReportSlashCommand,
    destiny2SlashCommand,
    helpSlashCommand,
    infoSlashCommand,
    issSlashCommand,
    modMailSlashCommand,
    quoteSlashCommand,
];
//#endregion

//#region Exports
export { activeGlobalSlashCommands };
//#endregion
