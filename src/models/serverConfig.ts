import { Schema, model } from 'mongoose';

//#region ServerConfig interface
interface ServerConfig {
    _id: string;
    guildID: string;
    setupNeeded?: boolean;
    prefix?: string;
    autoRole?: {
        enable: boolean;
        embedMessage: string;
        embedFooter: string;
        roles: string[];
        reactions: string[];
    };
    joinRole?: {
        enabled: boolean;
        role: string;
    };
    music?: {
        enable: boolean;
        djRoles: string;
        textChannel: string;
    };
    general?: {
        adminRoles: string[];
        modRoles: string[];
    };
    modMail?: {
        enable: boolean;
        modList: string[];
    };
    JTCVC?: {
        enable: boolean;
        voiceChannel: string;
    };
    blame?: {
        enable: boolean;
        cursing: boolean;
        offset: number;
        permList: string[];
        rotateList: string[];
    };
    logging?: {
        enable: boolean;
        loggingChannel: string;
        voice: {
            enabled: boolean;
        };
    };
}
//#endregion

//#region ServerConfig Schema
const serverConfigSchema = new Schema<ServerConfig>({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
});

const MongooseServerConfig = model('Server-Config', serverConfigSchema);
//#endregion

//#region exports
export { MongooseServerConfig, ServerConfig, serverConfigSchema };
//#endregion
