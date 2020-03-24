const os = require("os");
const systemInformation = require("systeminformation");


/**
 * This will get the CIDR of your network based on your active interface IP
 * @param {String} ip 
 */

module.exports = {
    getProgress: function(promises, progress_cb) {
        let resolvedCount = 0;
        progress_cb(0);
        for (const promise of promises) {
          promise.then(()=> {    
            resolvedCount++;
            progress_cb((resolvedCount * 100) / promises.length);
          });
        }
        return Promise.all(promises);
    },

    getDetails: function () {
        return new Promise(async resolve => {
            const defaultGateway = await systemInformation.networkGatewayDefault();
            const defaultIface = await systemInformation.networkInterfaceDefault();
            const ifaces = os.networkInterfaces();
            const ifaceData = ifaces[defaultIface].filter(({family}) => family === "IPv4")[0];
            ifaceData.gateway = defaultGateway;
            resolve(ifaceData)
        })
    }
}