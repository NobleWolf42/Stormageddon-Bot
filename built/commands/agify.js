var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorCustom, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { capitalize } from '../helpers/stringHelpers.js';
import axios from 'axios';
//#endregion
//#region This creates the agify command with the information about it
const agifyCommand = {
    name: 'agify',
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: 'agify ***INSERT-NAME***',
    description: "Uses [Agify.io](https://agify.io/) to estimate someone's age based off of their name. (Works in Direct Messages too.)",
    execute(message, args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            //#region Escape Conditionals
            //This checks for user input and exits if there is none
            if (args[0] == undefined) {
                warnCustom(message, 'No user input detected, are you sure you put a name?', this.name);
                return;
            }
            //#endregion
            //#region Main Logic - Reaches out to the agify api and handles the response
            axios.get('https://api.agify.io/?name=' + args[0]).then((response) => {
                //Escape Logic in case api fails to respond with data
                if (response.status < 200 && response.status >= 400) {
                    errorCustom(message, 'The Agify API was unable to be reached at this time. \n Try again later.', agifyCommand.name, client);
                }
                embedCustom(message, 'Agify', '#5D3FD3', '\n The age of ' + capitalize(args[0]) + ' is estimated at ' + response.data.age + '.', {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                }, null, [], null, null);
            });
            //#endregion
        });
    },
};
//#endregion
//#region Exports
export default agifyCommand;
//#endregion
