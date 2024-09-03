//#region Imports
import { Message } from 'discord.js';
//#endregion

//#region MessageWithDeleted Type
type MessageWithDeleted = Message & { deleted?: boolean };
//#endregion

//#region Exports
export { MessageWithDeleted };
//#endregion
