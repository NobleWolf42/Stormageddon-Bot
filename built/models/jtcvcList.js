import { Schema, model } from 'mongoose';
//#endregion
//#region AutoRoleList Schema
const jtcvcListSchema = new Schema({
    _id: { type: String, required: true },
    memberID: { type: String, required: true },
});
const MongooseJTCVCList = model('JTCVC-List', jtcvcListSchema);
//#endregion
//#region exports
export { MongooseJTCVCList };
//#endregion
