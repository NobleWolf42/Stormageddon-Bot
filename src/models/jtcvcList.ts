import { Schema, model } from 'mongoose';

//#region JTCVCList interface
interface JTCVCList {
    _id: string;
    memberID: string;
}
//#endregion

//#region AutoRoleList Schema
const jtcvcListSchema = new Schema<JTCVCList>({
    _id: { type: String, required: true },
    memberID: { type: String, required: true },
});

const MongooseJTCVCList = model('JTCVC-List', jtcvcListSchema);
//#endregion

//#region exports
export { MongooseJTCVCList, JTCVCList };
//#endregion
