var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
            console.log('Start Test Command');
            //#region Commands with no arguments
            yield collections.commands.get('creatermsg').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('info').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('iss').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('logs').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('quote').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Music commands
            yield collections.commands.get('remove').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('resume').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('autoplay').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('showqueue').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('shuffle').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('skip').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('skipto').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('stop').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('volume').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('loop').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('lyrics').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('pause').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('play').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('playnext').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Simple Commands
            yield collections.commands.get('agify').execute(message, ['John'], client, distube, collections, serverConfig);
            yield collections.commands.get('bugreport').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('modmail').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('clear').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('devSend').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('say').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Complicated Commands
            yield collections.commands.get('changeprefix').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('addmod').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('removemod').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
            //#region Commands with Subcommands
            yield collections.commands.get('blame').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('destiny2').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('help').execute(message, [], client, distube, collections, serverConfig);
            yield collections.commands.get('jtc').execute(message, [], client, distube, collections, serverConfig);
            //#endregion
        });
    },
};
//#endregion
//#region Exports
export default testCommand;
//#endregion
