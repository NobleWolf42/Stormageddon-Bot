import blameSlashCommand from './blame.js';
import changePrefixSlashCommand from './changePrefix.js';
import clearSlashCommand from './clear.js';
import createRoleMessageSlashCommand from './createAutoRoleMessage.js';
import editBlameSlashCommand from './editBlame.js';
import joinToCreateSlashCommand from './jtc.js';
import modSlashCommand from './mod.js';
import musicSlashCommand from './music.js';
import saySlashCommand from './say.js';
import setSlashCommand from './set.js';
//#endregion
//#region Global Slash Command Array
const activeGuildSlashCommands = [
    blameSlashCommand,
    changePrefixSlashCommand,
    clearSlashCommand,
    createRoleMessageSlashCommand,
    editBlameSlashCommand,
    joinToCreateSlashCommand,
    modSlashCommand,
    musicSlashCommand,
    saySlashCommand,
    setSlashCommand,
];
//#endregion
//#region Exports
export { activeGuildSlashCommands };
//#endregion
