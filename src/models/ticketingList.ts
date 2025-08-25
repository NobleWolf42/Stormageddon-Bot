import { Schema, model } from 'mongoose';

//#region TicketList interface
interface TicketChannel {
    id: string;
    messageIDs: string[];
}

interface TicketList {
    _id: string;
    guildID: string;
    ticketNumber: number;
    ticketChannels: TicketChannel[];
}
//#endregion

//#region TicketList Schema
const ticketListSchema = new Schema<TicketList>({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    ticketNumber: { type: Number, required: true },
    ticketChannels: { type: [{ id: String, messageIDs: [String] }], required: true },
});

const MongooseTicketList = model('Ticket-List', ticketListSchema);
//#endregion

//#region exports
export { MongooseTicketList, TicketList, TicketChannel };
//#endregion
