const {Pinger, getDetails} = require('./src/pinger');
const pinger = new Pinger();
(async function() {
    console.log(await pinger.ping("172.16.7.11"))
    console.log(await pinger.ping("172.16.7.14"))
})()
module.exports = {Pinger, getDetails}