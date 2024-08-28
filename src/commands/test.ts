import { MongooseServerConfig, ServerConfig } from '../models/serverConfig';

//#region This exports the test command with the information about it
module.exports = {
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
            _id: 'testIDString2',
            guildID: Date.now().toLocaleString(),
        };
        const newConfig = new MongooseServerConfig({ ...typeScriptNewConfig });

        try {
            await newConfig.save();
        } catch (err) {
            console.log(err);
        }

        console.log(await MongooseServerConfig.findById('testIDString2').exec().toObject());
        console.log(await MongooseServerConfig.findById('testIDString').exec().toObject());
        console.log('testing nodemon');
    },
};
//#endregion
