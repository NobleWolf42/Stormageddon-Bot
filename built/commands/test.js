var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//#endregion
//#region This exports the test command with the information about it
const testCommand = {
    name: 'test',
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'dev',
    usage: 'test',
    description: 'Testing command - @ someone',
    execute(message, _args, client, distube, collections, serverConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('');
            console.log('Join a Voice Chat!');
            console.log('Starting Test Command');
            //#region Commands with no arguments
            yield collections.commands.get('createrolemessage').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('info').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('iss').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('logs').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('quote').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Music commands
            yield collections.commands.get('play').execute(message, ['https://www.youtube.com/playlist?list=PLFgZ5KdvG7UShk8ijQSd84vYZ35jr8wOL'], client, distube, collections, serverConfig);
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            yield collections.commands.get('autoplay').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('loop').execute(message, ['song'], client, distube, collections, serverConfig);
            yield collections.commands.get('loop').execute(message, ['queue'], client, distube, collections, serverConfig);
            yield collections.commands.get('loop').execute(message, ['off'], client, distube, collections, serverConfig);
            yield collections.commands.get('remove').execute(message, ['72'], client, distube, collections, serverConfig);
            yield collections.commands.get('pause').execute(message, [], client, distube, collections, serverConfig);
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            yield collections.commands.get('resume').execute(message, [], client, distube, collections, serverConfig);
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            yield collections.commands.get('playnext').execute(message, ['crossfire'], client, distube, collections, serverConfig);
            yield collections.commands.get('playnext').execute(message, ['crossfire'], client, distube, collections, serverConfig);
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            yield collections.commands.get('skip').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('lyrics').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('showqueue').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('shuffle').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('volume').execute(message, ['5'], client, distube, collections, serverConfig);
            yield new Promise((resolve) => setTimeout(resolve, 5000));
            yield collections.commands.get('skipto').execute(message, ['71'], client, distube, collections, serverConfig);
            yield new Promise((resolve) => setTimeout(resolve, 10000));
            yield collections.commands.get('stop').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Simple Commands
            yield collections.commands.get('agify').execute(message, ['John'], client, distube, collections, serverConfig);
            yield collections.commands.get('bugreport').execute(message, ['Test', 'Message.'], client, distube, collections, serverConfig);
            yield collections.commands.get('say').execute(message, ['Test', 'message!'], client, distube, collections, serverConfig);
            yield collections.commands.get('addmod').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('modmail').execute(message, ['644966355875135499,', 'test', 'message'], client, distube, collections, serverConfig);
            yield collections.commands.get('removemod').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            yield new Promise((resolve) => setTimeout(resolve, 10000));
            //#region Complicated Commands
            //#region Change Prefix
            const oldPrefix = serverConfig.prefix;
            if (oldPrefix == '!') {
                yield collections.commands.get('changeprefix').execute(message, ['*'], client, distube, collections, serverConfig);
            }
            else {
                yield collections.commands.get('changeprefix').execute(message, ['!'], client, distube, collections, serverConfig);
            }
            yield collections.commands.get('changeprefix').execute(message, [oldPrefix], client, distube, collections, serverConfig);
            //#endregion
            //#region DevSend
            for (const devID of process.env.devIDS.split(',')) {
                yield collections.commands.get('devsend').execute(message, [`${devID},`, 'test', 'message'], client, distube, collections, serverConfig);
            }
            //#endregion
            //#region Help
            for (const command of collections.commands) {
                const commandClasses = [];
                if (commandClasses.indexOf(command[1].name) > -1) {
                    yield collections.commands.get('help').execute(message, [], client, distube, collections, serverConfig);
                    commandClasses.push(command[1].name);
                }
            }
            //#endregion
            //#endregion
            //#region Commands with Subcommands
            //#region Blame Command
            yield collections.commands.get('blame').execute(message, ['add'], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, ['addperm'], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, ['list'], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, ['remove'], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, ['removeperm'], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, ['list'], client, distube, collections, serverConfig);
            yield collections.commands.get('blame').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Destiny 2 Command
            yield collections.commands.get('destiny2').execute(message, ['clan', 'crota'], client, distube, collections, serverConfig);
            //#endregion
            //#endregion
            console.log('Test Command Complete. Remember that Set/Setup commands, Blame Fix, Join To Create, and Clear all need manual testing.');
            console.log('');
        });
    },
};
//#endregion
//#region Exports
export default testCommand;
//#endregion
