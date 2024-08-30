"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomDoggo = getRandomDoggo;
//region Data Files
var dogData = require('../data/stormPics.json').data;
//#endregion
//#region Helpers
var math_1 = require("./math");
//#endregion
//#region function to return a rand picture of stormageddon
/**
 * This function gets a link to a random picture of Stormageddon.
 * @returns {string} A link to a random picture of Stormageddon
 */
function getRandomDoggo() {
    return dogData[(0, math_1.getRandomInt)(dogData.length)].link;
}
