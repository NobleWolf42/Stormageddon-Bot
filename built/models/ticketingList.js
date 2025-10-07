import { Schema, model } from 'mongoose';
//#endregion
//#region TicketList Schema
const ticketListSchema = new Schema({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    ticketChannels: { type: [{ id: String, messageIDs: [String] }], required: true },
});
const MongooseTicketList = model('Ticket-List', ticketListSchema);
//#endregion
//#region exports
export { MongooseTicketList };
//#endregion
