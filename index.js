const {Pinger, utils} = require('./src/pinger');
const pinger = new Pinger();
(async function(){
    const data = await utils.getDetails();
    console.log(await pinger.ping("172.16.7.11"))
})();
module.exports = {Pinger, utils};