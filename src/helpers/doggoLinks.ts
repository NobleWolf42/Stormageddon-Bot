//region Data Files
import dogData from '../data/stormPics.js';
//#endregion

//#region Helpers
import { getRandomInt } from './math.js';
//#endregion

//#region function to return a rand picture of stormageddon
/**
 * This function gets a link to a random picture of Stormageddon.
 * @returns A link to a random picture of Stormageddon
 */
function getRandomDoggo() {
    return dogData[getRandomInt(dogData.length)].link;
}
//#endregion

export { getRandomDoggo };
