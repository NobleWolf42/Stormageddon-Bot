var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MongooseServerConfig } from '../models/serverConfig.js';
//#region This exports the test command with the information about it
const testCommand = {
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
                _id: '644966355875135499',
                guildID: '644966355875135499',
                prefix: '*',
                setupNeeded: false,
                autoRole: {
                    enable: true,
                    embedMessage: 'heal',
                    embedFooter: 'If you do not receive the role try reacting again.',
                    roles: ["Sona's DJs", 'Stormageddon Bot Contributor'],
                    reactions: ['<:scareddog:818542767449702420>', '🐕'],
                },
                joinRole: { enable: true, role: 'Queue Bot Contributor' },
                music: { enable: true, djRoles: ["Sona's DJs"], textChannel: 'botspam' },
                general: { adminRoles: ['Server Admin'], modRoles: ['Server Admin', 'Some people the devs know'] },
                modMail: { modList: ['201665936049176576'], enable: true },
                JTCVC: { enable: true, voiceChannel: '1259031022658650132' },
                blame: { enable: true, cursing: true, permList: [], rotateList: ['HypersonicWalrus', 'NobleWolf42', 'End3rman07', 'Chris Cugs', '--Thor--', 'spacewulf'], offset: -2 },
                logging: { enable: true, voice: { enable: true }, loggingChannel: '649109835404673024' },
            };
            //const newConfig = new MongooseServerConfig({ ...typeScriptNewConfig });
            //try {
            //    await newConfig.save();
            //} catch (err) {
            //    console.log(err);
            //}
            //console.log(await MongooseServerConfig.findById('testIDString2').exec());
            //console.log(await MongooseServerConfig.findById('testIDString').exec());
            console.log('testing nodemon');
            yield MongooseServerConfig.findByIdAndUpdate(message.guild.id, typeScriptNewConfig).exec();
            //testConfig.save();
        });
    },
};
//#endregion
//#region Exports
export default testCommand;
//#endregion
