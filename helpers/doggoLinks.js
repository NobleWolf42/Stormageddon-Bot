const { getRandomInt } = require('./math.js');
const dogdata = require('../data/stormpics.json').data;

function getRandomDoggo() {
        return dogdata[getRandomInt(dogdata.length)].link;
    }

module.exports = { getRandomDoggo };