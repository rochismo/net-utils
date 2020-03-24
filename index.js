const {Pinger, utils} = require('./src/pinger');

(async () => {
    const dataUtils = await utils.getDetails();
    const x = new Pinger(null, dataUtils.address);
    const data = await x.ping("192.168.1.33");
    console.log(data);
})();

module.exports = {Pinger, utils};