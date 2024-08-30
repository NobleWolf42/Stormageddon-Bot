"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = getRandomInt;
exports.isInteger = isInteger;
//#region Function that will give you a random number between 0 and the max number passed
/**
 * This function will give you a random number between 0 and the max number passed.
 * @param max - Maximum integer for the random integer
 * @returns A random integer from 0 to max
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
//#endregion
//#region Function that checks passed value to see if it is an integer
/**
 * This function checks passed value to see if it is an integer
 * @param value - A value of some kind
 * @returns True if input was a number, otherwise returns false
 */
function isInteger(value) {
    return /^\d+$/.test(value);
}
//#endregion
