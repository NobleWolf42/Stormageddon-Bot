import { Schema, model } from 'mongoose';
//#endregion
//#region TicketList Schema
const ticketListSchema = new Schema({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    roleChannels: { type: [{ id: String, messageIDs: [String] }], required: true },
});
const MongooseTicketList = model('Auto-Role-List', ticketListSchema);
//#endregion
//#region exports
export { MongooseTicketList };
//#endregion
