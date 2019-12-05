var xmlhttp = require("xmlhttprequest");

var XMLHttpRequest = xmlhttp.XMLHttpRequest;

function iss(message){
    var request = new XMLHttpRequest()
    request.open('GET', 'http://api.open-notify.org/astros.json', true)
    request.onload = function() {
       // Begin accessing JSON data here
       var data = JSON.parse(request.responseText)

       if (request.status >= 200 && request.status < 400) {
         var response = "\n [Astronaut Information]";

         Array.from(data.people).forEach(function(people){
           response += "\n " + people.name + " : " + people.craft;
         })
         
          message.reply(response);
      } else {
         console.log('error');
         message.reply("The ISS API was unable to be reached at this time. \n Try again later.");
      }
    }

    request.send()
}

module.exports = { iss };