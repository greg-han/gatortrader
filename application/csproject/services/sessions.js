//This will eventually replace what's in app.js to clean it up
//write this one statically
var session = require('client-sessions');
let clientsessions = session({
    cookieName : 'session',
    secret: 'balh!!',
    duration: 30*60*1000,
    activeDuration: 5*50*1000,
});

module.exports = clientsessions;
