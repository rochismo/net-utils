const net = require("network");
const arp = require("nodearp")
const os = require("os");

function determineCidr(ip) {
    const ifaces = os.networkInterfaces();
    let cidrValue = "192.168.1.0/24"
    for (const iface in ifaces) {
        const ifaceObj = ifaces[iface];

        ifaceObj.forEach(({ address, cidr }) => {
            if (address == ip) {
                cidrValue = cidr;
            }
        })
    }
    return cidrValue.split("/")[1]
}

function getActiveIface() {
    return new Promise(resolve => {
        net.get_active_interface(function (error, iface) {
            resolve(iface);
        })
    });
}

function getGatewayMac(gateway) {
    return new Promise(resolve => {
        arp.entries(entries => {
            const mac = entries.filter(entry => entry.ip === gateway)[0].mac
            resolve(mac)
        })
    })
}

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
            const {gateway_ip, ip_address} = await getActiveIface();
            const gatewayMac = await getGatewayMac(gateway_ip);
            const cidr = determineCidr(ip_address)
            const ip_cidr = `${gateway_ip}/${cidr}`
            resolve({ ip_cidr, gatewayMac })
        })
    }

}