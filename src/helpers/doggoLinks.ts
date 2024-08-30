//region Data Files
const dogData = require('../data/stormPics.json').data;
//#endregion

//#region Helpers
import { getRandomInt } from './math';
//#endregion

//#region function to return a rand picture of stormageddon
/**
 * This function gets a link to a random picture of Stormageddon.
 * @returns {string} A link to a random picture of Stormageddon
 */
function getRandomDoggo() {
    return dogData[getRandomInt(dogData.length)].link;
}
//#endregion

export { getRandomDoggo };
