const {Pinger, getDetails} = require('./src/pinger');

(async function() {
    console.log(await getDetails())
})()
module.exports = {Pinger, getDetails}