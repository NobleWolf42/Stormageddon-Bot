import { Schema, model } from 'mongoose';
//#endregion
//#region ServerConfig Schema
const serverConfigSchema = new Schema({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    setupNeeded: { type: Boolean, required: true },
    prefix: { type: String, required: true },
    autoRole: {
        enable: { type: Boolean, required: true },
        embedMessage: { type: String, required: true },
        embedFooter: { type: String, required: true },
        roles: { type: (Array), required: true },
        reactions: { type: (Array), required: true },
    },
    joinRole: {
        enable: { type: Boolean, required: true },
        role: { type: String, required: true },
    },
    music: {
        enable: { type: Boolean, required: true },
        djRoles: { type: (Array), required: true },
        textChannel: { type: String, required: true },
    },
    general: {
        adminRoles: { type: (Array), required: true },
        modRoles: { type: (Array), required: true },
    },
    modMail: {
        enable: { type: Boolean, required: true },
        modList: { type: (Array), required: true },
    },
    JTCVC: {
        enable: { type: Boolean, required: true },
        voiceChannel: { type: String, required: true },
    },
    blame: {
        enable: { type: Boolean, required: true },
        cursing: { type: Boolean, required: true },
        offset: { type: Number, required: true },
        permList: { type: (Array), required: true },
        rotateList: { type: (Array), required: true },
    },
    logging: {
        enable: { type: Boolean, required: true },
        loggingChannel: { type: String, required: true },
        voice: {
            enable: { type: Boolean, required: true },
        },
    },
});
const MongooseServerConfig = model('Server-Config', serverConfigSchema);
//#endregion
//#region exports
export { MongooseBotConfig, BotConfig };
//#endregion
