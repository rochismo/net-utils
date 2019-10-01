const ping = require("net-ping");
const ip_cidr = require("ip-cidr");
const utils = require('./utils')

const defaultSettings = {
    networkProtocol: ping.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    sessionId: (process.pid % 65535),
    timeout: 2000,
    ttl: 128
};
class Pinger {
    /**
     * 
     * 
     * @param {String} address 
     * @param {Object} sse
     *  
     */
    constructor(settings, sse) {
        this.hosts = [];
        this.sse = sse;
        this.settings = {
            ...settings,
            ...defaultSettings
        }
        this.session = ping.createSession(this.settings);
        this.aliveHosts = [];

        utils.getProgress.bind(this);
    }

    /**
     * The ip parameter must contain the network cidr
     * @param {String} ip 
     */

    pingSweep(ip) {
        this.setRange(ip);
        this.populate();
        return this.fulfillPromisesAndFilterHosts();
        
    }

    populate() {
        if (!this.hosts.length) {
            return console.error("There are no hosts available")
        }
        this.hosts.forEach(host => {
            this.aliveHosts.push(this.ping(host));
        });
    }

    async fulfillPromisesAndFilterHosts() {
        const alive = await utils.getProgress(this.aliveHosts,
            (progress) => {
                if (this.sse) {
                    this.sse.send(progress.toFixed(2))
                }
            })
        return alive.filter(host => host !== false)
    }

    setRange(ip) {
        const cidr = ip.split("/")[1];
        if (!cidr) return console.error("No cidr specified")
        this.aliveHosts = []
        this.hosts = new ip_cidr(ip).toArray();
    }

    ping(ip) {
        return new Promise(res => {
            this.session.pingHost(ip, (err, target) => {
                if (!err) {
                    res(target);
                } else {
                    res(false)
                }
            })
        })
    }
};

module.exports = { Pinger, utils };
