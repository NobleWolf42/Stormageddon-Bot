var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongooseServerConfig } from '../models/serverConfig';
//#region This exports the test command with the information about it
module.exports = {
    name: 'test',
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'dev',
    usage: 'test',
    description: 'Testing command',
    execute(message, args, client, distube) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Start Test Command');
            const typeScriptNewConfig = {
                _id: 'testIDString2',
                guildID: 'not working',
            };
            const newConfig = new MongooseServerConfig(Object.assign({}, typeScriptNewConfig));
            try {
                yield newConfig.save();
            }
            catch (err) {
                console.log(err);
            }
            console.log(yield MongooseServerConfig.findById('testIDString2').exec());
            console.log(yield MongooseServerConfig.findById('testIDString').exec());
            console.log('testing nodemon');
            var testConfig = yield MongooseServerConfig.findById('testIDString2').exec();
            testConfig.guildID = 'working';
            testConfig.save();
        });
    },
};
//#endregion
