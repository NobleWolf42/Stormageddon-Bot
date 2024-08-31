import { Schema, model } from 'mongoose';
//#endregion
//#region ServerConfig Schema
const serverConfigSchema = new Schema({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
});
const MongooseServerConfig = model('Server-Config', serverConfigSchema);
//#endregion
//#region exports
export { MongooseServerConfig };
//#endregion
