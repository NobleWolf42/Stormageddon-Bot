//region Data Files
const dogdata = require('../data/stormPics.json').data;
//#endregion

//#region Helpers
const { getRandomInt } = require('./math.js');
//#endregion

//#region function to return a rand picture of stormageddon
/**
 * This function gets a link to a random picture of Stormageddon.
 * @returns {URL} A link to a random picture of Stormageddon
 */
function getRandomDoggo() {
    return dogdata[getRandomInt(dogdata.length)].link;
}
//#endregion

module.exports = { getRandomDoggo };