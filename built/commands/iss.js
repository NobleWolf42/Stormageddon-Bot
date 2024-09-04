var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { errorCustom, embedCustom } from '../helpers/embedMessages.js';
//#endregion
//#region This creates the iss command with the information about it
const issCommand = {
    name: 'iss',
    type: ['DM', 'Guild'],
    aliases: [],
    coolDown: 60,
    class: 'fun',
    usage: 'iss',
    description: 'Displays the names of all the astronauts that are in transit to/from, or currently aboard the International Space Station. (Works in Direct Messages too.)',
    execute(message, args, client) {
        return __awaiter(this, void 0, void 0, function* () {
            var request = new XMLHttpRequest();
            request.open('GET', 'http://api.open-notify.org/astros.json', true);
            request.onload = function () {
                // Begin accessing JSON data here
                var data = JSON.parse(request.responseText);
                if (request.status >= 200 && request.status < 400) {
                    var response = '';
                    Array.from(data.people).forEach(function (people) {
                        response += '\n ' + people.name + ' : ' + people.craft;
                    });
                    embedCustom(message, 'Astronaut Information:', '#000000', response, {
                        text: `Requested by ${message.author.tag}`,
                        iconURL: null,
                    }, null, [], null, null);
                }
                else {
                    errorCustom(message, 'The ISS API was unable to be reached at this time. \n Try again later.', issCommand.name, client);
                }
            };
            request.send();
        });
    },
};
//#endregion
//#region Exports
export default issCommand;
//#endregion
