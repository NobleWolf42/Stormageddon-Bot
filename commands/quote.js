var math = require('../helpers/math.js');
var quotedata = require('../data/quotes.json').data;

function getRandomQuote(message) {
    var quote = quotedata[math.getRandomInt(quotedata.length)];

    message.channel.send(
        "\"" + quote.text + 
        "\" \n Cited from " + quote.author + "." + 
        " \n Picked by " + quote.submitter + "."
    );
}

module.exports = { getRandomQuote };