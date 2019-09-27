const ping = require("net-ping");
const ip_cidr = require("ip-cidr");
const { getProgress, getDetails } = require('./utils')

class Pinger {
    /**
     * 
     * 
     * @param {String} address 
     * @param {Object} sse
     *  
     */
    constructor(address, sse) {
        this.hosts = []
        this.sse = sse;
        if (address) {
            this.hosts = new ip_cidr(address).toArray();
        }
        this.aliveHosts = [];
        this.session = ping.createSession();
        getProgress.bind(this);
    }

    /**
     * The ip parameter must contain the network cidr
     * @param {String} ip 
     */

    async pingSweep(ip) {
        const cidr = ip.split("/")[1];
        if (!cidr) return console.error("No cidr specified")
        this.setRange(ip);
        this.populate();
        await this.fulfillPromisesAndFilterHosts();
        return this.aliveHosts;
    }

    populate() {
        if (!this.hosts.length) {
            return console.error("There are no hosts available")
        }

        this.hosts.forEach(host => {
            this.aliveHosts.push(new Promise((res, rej) => {
                this.session.pingHost(host, function (error, target) {
                    // We always want to resolve and not stop if host is not alive
                    if (!error) {
                        res(host);
                    } else {
                        res(false);
                    }
                });
            }));
        });
    }

    async fulfillPromisesAndFilterHosts() {
        const alive = await getProgress(this.aliveHosts,
            (p) => {
                if (this.sse) {
                    this.sse.send(p.toFixed(2))
                }
            })
        this.aliveHosts = alive.filter(host => host !== false)
    }

    setRange(ip) {
        this.aliveHosts = []
        this.hosts = new ip_cidr(ip).toArray();
    }

    ping(ip) {
        return new Promise(res => {
            this.session.pingHost(ip, function (err, target) {
                if (!err) {
                    res(target);
                } else {
                    res(false)
                }
            })
        })
    }
};

module.exports = {Pinger, getDetails};
