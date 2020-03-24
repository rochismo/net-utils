const ping = require("@rochismo/ping");
const ip_cidr = require("ip-cidr");
const utils = require("./utils");
const Host = require("./models/host.js");
class Pinger {
    /**
     * @param {Object} sse -> Used for server sent events to track progress
     *
     */
    constructor(sse, selfAddress) {
        this.hosts = [];
        this.sse = sse;
        this.aliveHosts = [];
        this.selfAddress = selfAddress;
        utils.getProgress.bind(this);
    }

    /**
     * The ip parameter must contain the network cidr
     * @param {String} ip
     * @returns {Array|Promise} hosts
     */

    pingSweep(ip) {
        this.setRange(ip);
        this.populate();
        return this.fulfillPromisesAndFilterHosts();
    }

    /**
     *
     * @param {String} ip -> Must contain the cidr
     */
    setRange(ip) {
        const cidr = ip.split("/")[1];
        if (!cidr) return console.error("No cidr specified");
        this.aliveHosts = [];
        this.hosts = new ip_cidr(ip).toArray();
    }

    populate() {
        if (!this.hosts.length) {
            return console.error("There are no hosts available");
        }
        this.aliveHosts = this.hosts.map(host => {
            return this.ping(host);
        });
    }

    async fulfillPromisesAndFilterHosts() {
        const pingedHosts = await utils.getProgress(
            this.aliveHosts,
            progress => {
                if (this.sse) {
                    this.sse.send(progress.toFixed(2));
                }
            }
        );
        return pingedHosts
            .filter(host => host.alive)
            .map(data => {
                return new Host(data);
            });
    }

    ping(ip) {
        return ping.promise.probe(ip);
    }
}

module.exports = { Pinger, utils };
