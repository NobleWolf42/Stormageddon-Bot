//#region Imports
import { Command } from '../models/commandModel.js';
//#endregion

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
        console.log('');
        console.log('Join a Voice Chat!');
        console.log('Starting Test Command');

        //#region Commands with no arguments
        await collections.commands.get('createrolemessage').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('info').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('iss').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('logs').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('quote').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Music commands
        await collections.commands.get('play').execute(message, ['https://www.youtube.com/playlist?list=PLFgZ5KdvG7UShk8ijQSd84vYZ35jr8wOL'], client, distube, collections, serverConfig);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await collections.commands.get('autoplay').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('loop').execute(message, ['song'], client, distube, collections, serverConfig);
        await collections.commands.get('loop').execute(message, ['queue'], client, distube, collections, serverConfig);
        await collections.commands.get('loop').execute(message, ['off'], client, distube, collections, serverConfig);
        await collections.commands.get('remove').execute(message, ['72'], client, distube, collections, serverConfig);
        await collections.commands.get('pause').execute(message, [], client, distube, collections, serverConfig);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await collections.commands.get('resume').execute(message, [], client, distube, collections, serverConfig);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await collections.commands.get('playnext').execute(message, ['crossfire'], client, distube, collections, serverConfig);
        await collections.commands.get('playnext').execute(message, ['crossfire'], client, distube, collections, serverConfig);

        await new Promise((resolve) => setTimeout(resolve, 5000));

        await collections.commands.get('skip').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('lyrics').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('showqueue').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('shuffle').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('volume').execute(message, ['5'], client, distube, collections, serverConfig);

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await collections.commands.get('skipto').execute(message, ['71'], client, distube, collections, serverConfig);

        await new Promise((resolve) => setTimeout(resolve, 10000));
        await collections.commands.get('stop').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Simple Commands
        await collections.commands.get('agify').execute(message, ['John'], client, distube, collections, serverConfig);
        await collections.commands.get('bugreport').execute(message, ['Test', 'Message.'], client, distube, collections, serverConfig);
        await collections.commands.get('say').execute(message, ['Test', 'message!'], client, distube, collections, serverConfig);
        await collections.commands.get('addmod').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('modmail').execute(message, ['644966355875135499,', 'test', 'message'], client, distube, collections, serverConfig);
        await collections.commands.get('removemod').execute(message, [], client, distube, collections, serverConfig);
        //#endregion
        await new Promise((resolve) => setTimeout(resolve, 10000));
        //#region Complicated Commands
        //#region Change Prefix
        const oldPrefix = serverConfig.prefix;
        if (oldPrefix == '!') {
            await collections.commands.get('changeprefix').execute(message, ['*'], client, distube, collections, serverConfig);
        } else {
            await collections.commands.get('changeprefix').execute(message, ['!'], client, distube, collections, serverConfig);
        }

        await collections.commands.get('changeprefix').execute(message, [oldPrefix], client, distube, collections, serverConfig);
        //#endregion

        //#region DevSend
        for (const devID of process.env.devIDS.split(',')) {
            await collections.commands.get('devsend').execute(message, [`${devID},`, 'test', 'message'], client, distube, collections, serverConfig);
        }
        //#endregion

        //#region Help
        for (const command of collections.commands) {
            const commandClasses: string[] = [];
            if (commandClasses.indexOf(command[1].name) > -1) {
                await collections.commands.get('help').execute(message, [], client, distube, collections, serverConfig);
                commandClasses.push(command[1].name);
            }
        }
        //#endregion
        //#endregion

        //#region Commands with Subcommands
        //#region Blame Command
        await collections.commands.get('blame').execute(message, ['add'], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, ['addperm'], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, ['list'], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, [], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, ['remove'], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, ['removeperm'], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, ['list'], client, distube, collections, serverConfig);
        await collections.commands.get('blame').execute(message, [], client, distube, collections, serverConfig);
        //#endregion

        //#region Destiny 2 Command
        await collections.commands.get('destiny2').execute(message, ['clan', 'crota'], client, distube, collections, serverConfig);
        //#endregion
        //#endregion

        console.log('Test Command Complete. Remember that Set/Setup commands, Blame Fix, Join To Create, and Clear all need manual testing.');
        console.log('');
    },
};
//#endregion

//#region Exports
export default testCommand;
//#endregion
