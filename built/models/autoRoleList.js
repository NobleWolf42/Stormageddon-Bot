import { Schema, model } from 'mongoose';
//#endregion
//#region AutoRoleList Schema
const autoRoleListSchema = new Schema({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    channelIDs: { type: (Array), required: true },
});
const MongooseAutoRoleList = model('Auto-Role-List', autoRoleListSchema);
//#endregion
//#region exports
export { MongooseAutoRoleList };
//#endregion
