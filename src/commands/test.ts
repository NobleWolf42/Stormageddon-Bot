import { Command } from '../models/commandModel.js';

//#region This exports the test command with the information about it
const testCommand: Command = {
    name: 'test',
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'dev',
    usage: 'test',
    description: 'Testing command - @ someone',
    async execute(message, _args, client, distube, collections, serverConfig) {
        console.log('Start Test Command');
        //#region Commands with no arguments
        await collections.commands.get('creatermsg').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('info').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('iss').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('logs').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('quote').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Music commands
        await collections.commands.get('remove').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('resume').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('autoplay').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('showqueue').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('shuffle').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('skip').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('skipto').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('stop').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('volume').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('loop').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('lyrics').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('pause').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('play').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('playnext').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Simple Commands
        await collections.commands.get('agify').execute(message, ['John'], client, distube, collections, serverConfig);
        await collections.commands.get('bugreport').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('modmail').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('clear').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('devSend').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('say').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Complicated Commands
        await collections.commands.get('changeprefix').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('addmod').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('removemod').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Commands with Subcommands
        await collections.commands.get('blame').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('destiny2').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('help').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('jtc').execute(message, [], client, distube, collections, serverConfig);
        //#endregion
    },
};
//#endregion

//#region Exports
export default testCommand;
//#endregion
