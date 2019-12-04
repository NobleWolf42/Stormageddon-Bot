var currentdate = new Date();
var date = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var datetime = date[currentdate.getMonth()] + ' ' + currentdate.getDay() + " " + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
console.log(datetime);