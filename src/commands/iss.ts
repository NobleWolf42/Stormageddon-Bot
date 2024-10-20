//#region Imports
import { Command } from '../models/commandModel.js';
import { errorCustom, embedCustom } from '../helpers/embedMessages.js';
import { ISSData } from '../models/issModel.js';
import axios, { AxiosResponse } from 'axios';
//#endregion

//#region This creates the iss command with the information about it
const issCommand: Command = {
    name: 'iss',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 60,
    class: 'fun',
    usage: 'iss',
    description: 'Displays the names of all the astronauts that are in transit to/from, or currently aboard the International Space Station. (Works in Direct Messages too.)',
    async execute(message, _args, client) {
        axios.get('http://api.open-notify.org/astros.json').then((request: AxiosResponse<ISSData>) => {
            //#region Escape Conditionals
            if (request.status < 200 && request.status >= 400) {
                errorCustom(message, 'The ISS API was unable to be reached at this time. \n Try again later.', issCommand.name, client);
            }
            //#endregion

            //#region Main Logic - get the list of people in space and send the list in a message
            let response = '';

            Array.from(request.data.people).forEach(function (people) {
                response += '\n ' + people.name + ' : ' + people.craft;
            });

            embedCustom(
                message,
                'Astronaut Information:',
                '#000000',
                response,
                {
                    text: `Requested by ${message.author.tag}`,
                    iconURL: null,
                },
                null,
                [],
                null,
                null
            );
            //#endregion
        });
    },
};
//#endregion

//#region Exports
export default issCommand;
//#endregion
