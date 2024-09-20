//#region Imports
import { Command } from '../models/commandModel.js';
import { errorCustom, warnCustom, embedCustom } from '../helpers/embedMessages.js';
import { capitalize } from '../helpers/stringHelpers.js';
import axios from 'axios';

console.log(axios.isCancel('something'));
//#endregion

//#region This creates the agify command with the information about it
const agifyCommand: Command = {
    name: 'agify',
    type: ['Guild', 'DM'],
    aliases: [],
    coolDown: 0,
    class: 'fun',
    usage: 'agify ***INSERT-NAME***',
    description: "Uses [Agify.io](https://agify.io/) to estimate someone's age based off of their name. (Works in Direct Messages too.)",
    async execute(message, args, client) {
        //#region Escape Conditionals
        //This checks for user input and exits if there is none
        if (args[0] == undefined) {
            warnCustom(message, 'No user input detected, are you sure you put a name?', this.name);
            return;
        }
        //#endregion

        //#region Main Logic - Reaches out to the agify api and handles the response
        axios.get('https://api.agify.io/?name=' + args[0]).then((response) => {
            console.log(response.data);

            //Escape Logic in case api fails to respond with data
            if (response.status < 200 && response.status >= 400) {
                errorCustom(message, 'The Agify API was unable to be reached at this time. \n Try again later.', agifyCommand.name, client);
            }

            embedCustom(
                message,
                'Agify',
                '#5D3FD3',
                '\n The age of ' + capitalize(args[0]) + ' is estimated at ' + response.data.age + '.',
                {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                },
                null,
                [],
                null,
                null
            );
        });
        //#endregion
    },
};
//#endregion

//#region Exports
export default agifyCommand;
//#endregion
