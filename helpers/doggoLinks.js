var math = require('./math.js');
var dogdata = require('../data/stormpics.json').data;

function getRandomDoggo() {
        return dogdata[math.getRandomInt(dogdata.length)].link;
    }

module.exports = { getRandomDoggo };