import { Schema, model } from 'mongoose';

//#region AutoRoleList interface

interface RoleChannel {
    id: string;
    messageIDs: string[];
}

interface AutoRoleList {
    _id: string;
    guildID: string;
    roleChannels: RoleChannel[];
}
//#endregion

//#region AutoRoleList Schema
const autoRoleListSchema = new Schema<AutoRoleList>({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    roleChannels: { type: [{ id: String, messageIDs: [String] }], required: true },
});

const MongooseAutoRoleList = model('Auto-Role-List', autoRoleListSchema);
//#endregion

//#region exports
export { MongooseAutoRoleList, AutoRoleList, RoleChannel };
//#endregion
