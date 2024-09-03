import { Schema, model } from 'mongoose';

//#region ServerConfig interface
interface ServerConfig {
    _id: string;
    guildID: string;
    setupNeeded: boolean;
    prefix: string;
    autoRole: {
        enable: boolean;
        embedMessage: string;
        embedFooter: string;
        roles: string[];
        reactions: string[];
        embedThumbnail: string;
    };
    joinRole: {
        enable: boolean;
        role: string;
    };
    music: {
        enable: boolean;
        djRoles: string[];
        textChannel: string;
    };
    general: {
        adminRoles: string[];
        modRoles: string[];
    };
    modMail: {
        enable: boolean;
        modList: string[];
    };
    JTCVC: {
        enable: boolean;
        voiceChannel: string;
    };
    blame: {
        enable: boolean;
        cursing: boolean;
        offset: number;
        permList: string[];
        rotateList: string[];
    };
    logging: {
        enable: boolean;
        loggingChannel: string;
        voice: {
            enable: boolean;
        };
    };
}
//#endregion

//#region ServerConfig Schema
const serverConfigSchema = new Schema<ServerConfig>({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
    setupNeeded: { type: Boolean, required: true },
    prefix: { type: String, required: true },
    autoRole: {
        enable: { type: Boolean, required: true },
        embedMessage: { type: String, required: true },
        embedFooter: { type: String, required: true },
        roles: { type: Array<String>, required: true },
        reactions: { type: Array<String>, required: true },
        embedThumbnail: { type: String, required: true },
    },
    joinRole: {
        enable: { type: Boolean, required: true },
        role: { type: String, required: true },
    },
    music: {
        enable: { type: Boolean, required: true },
        djRoles: { type: Array<String>, required: true },
        textChannel: { type: String, required: true },
    },
    general: {
        adminRoles: { type: Array<String>, required: true },
        modRoles: { type: Array<String>, required: true },
    },
    modMail: {
        enable: { type: Boolean, required: true },
        modList: { type: Array<String>, required: true },
    },
    JTCVC: {
        enable: { type: Boolean, required: true },
        voiceChannel: { type: String, required: true },
    },
    blame: {
        enable: { type: Boolean, required: true },
        cursing: { type: Boolean, required: true },
        offset: { type: Number, required: true },
        permList: { type: Array<String>, required: true },
        rotateList: { type: Array<String>, required: true },
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
export { MongooseServerConfig, ServerConfig };
//#endregion
