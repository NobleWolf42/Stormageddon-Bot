"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseServerConfig = void 0;
var mongoose_1 = require("mongoose");
var Schema = mongoose_1.default.Schema, model = mongoose_1.default.model;
//#endregion
//#region ServerConfig Schema
var serverConfigSchema = new Schema({
    _id: { type: String, required: true },
    guildID: { type: String, required: true },
});
var MongooseServerConfig = model('Server-Config', serverConfigSchema);
exports.MongooseServerConfig = MongooseServerConfig;
//#endregion
