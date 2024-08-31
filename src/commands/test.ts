import { Command } from '../models/command.js';
import { MongooseServerConfig, ServerConfig } from '../models/serverConfig.js';

//#region This exports the test command with the information about it
const testCommand: Command = {
    name: 'test',
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'dev',
    usage: 'test',
    description: 'Testing command',
    async execute(message, args, client, distube) {
        console.log('Start Test Command');
        const typeScriptNewConfig: ServerConfig = {
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

        await MongooseServerConfig.findByIdAndUpdate(message.guild.id, typeScriptNewConfig).exec();
        //testConfig.save();
    },
};
//#endregion

//#region Exports
export default testCommand;
//#endregion
