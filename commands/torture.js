var DoggoLinks = require('../helpers/doggoLinks.js');
var Discord = require('discord.js');
var math = require('../helpers/math.js');

//#region torture function
function torture(message, user) {
    // Assigning variables
    var attachment = new Discord.Attachment(DoggoLinks.getRandomDoggo());
    var target = math.getRandomInt(100);

    // Torture game intro
    user.send(
        "Woof Woof <@" + user.id + ">" +
        "\n It's time to play a game like Russian Roulette...." +
        "\n Stormjack but not like Blackjack!" +
        "\n Guess a number between 1 and 100." +
        "\n If you are within 5, you get shamed." +
        "\n If you are more than 5 away from the number, you get kicked!" +
        "\n 30 seconds on the clock, if time runs out, you get shamed AND kicked!"
        , attachment
    ).then((newmsg) => {
        newmsg.channel.awaitMessages(response => (parseInt(response.content)<100), {
            max: 1,
            time: 30000,
            errors: ['time']
        }).then(mg => {
            if (Math.abs((parseInt(mg.first().content)-target) <= 5))  { // guess within range
                user.send(
                    "Right!" +
                    "\n The number was " + target + "." +
                    "\n You were close, but it's time to be kinkshamed by a dog!"
                );

                message.guild.channels.find(x => x.name === "general").send(
                    "<@" + user.id + "> got beaten by the almighty Stormaggedon." +
                    "\n They are into some weird wacky stuff, but they still survived."
                );
            }
            else if (Math.abs((parseInt(mg.first().content)-target)) <= 0){
                user.send(
                    "Right!" +
                    "\n The number was " + target + "." +
                    "\n You actually guessed the right number!"
                );

                message.guild.channels.find(x => x.name === "general").send(
                    "<@" + user.id + "> beat the almighty Stormaggedon." +
                    "\n They are into some weird wacky stuff, but they survived!"
                );
            }
            else { // guess out of range
                user.send(
                    "Wrong!" +
                    "\n Your guess was either too far off, or was not valid." +
                    "\n The number was " + target + "." +
                    "\n It's time to get booted by a ruff ruff like me!"
                );
        
                message.guild.channels.find(x => x.name === "general").send(
                    "<@" + user.id + "> got beaten by the almighty Stormaggedon." +
                    "\n They lost their game of stormjack!"
                ).then((newmsg) => {
                    if (newmsg.mentions.members.first().kick()) {
                        console.log(newmsg.mentions.members.first().username + " was kicked.");
                    }
                })
            }
        }).catch((err) => {
            user.send(
                "Ran out of time!" +
                "\n It's time to be kinkshamed by a dog!"
            );

            message.guild.channels.find(x => x.name === "general").send(
                "<@" + user.id + ">  got beaten by the almighty Stormaggedon." +
                "\n They lost their game of stormjack!"
            ).then((newmsg) => {
                if (newmsg.mentions.members.first().kick()) {
                    console.log(newmsg.mentions.members.first().username + " was kicked.");
                }
            })
        })
    })
}
//#endregion

module.exports = { torture };