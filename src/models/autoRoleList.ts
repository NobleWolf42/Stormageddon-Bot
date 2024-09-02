import { Schema, model } from 'mongoose';

//#region AutoRoleList interface
interface AutoRoleList {
    _id: string;
    guildID: string;
    channelIDs: string[];
}
//#endregion

//#region AutoRoleList Schema
const autoRoleListSchema = new Schema<AutoRoleList>({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    channelIDs: { type: Array<String>, required: true },
});

const MongooseAutoRoleList = model('Auto-Role-List', autoRoleListSchema);
//#endregion

//#region exports
export { MongooseAutoRoleList, AutoRoleList };
//#endregion
