# NodeJS Net Utils

This module's purpose is to make networking tasks simpler

## Getting Started

To run some of the functions of the module, you must run the program as a sudo user on linux systems, since it uses the raw-socket module on a module dependency (net-ping) by @stephenwvickers

### Installing

To install the module just run

```
npm install @rochismo/net-utils --save
```

## Functionality

For now, this module is capable of:

* Get your active interface ip / gateway / network-cidr 
* Ping a single host
* Ping sweep your network CIDR (Or any range of hosts within a specified CIDR)
* Track progress of ping sweep
    * Send the progress through a Server Sent Event



## Sample usage

# Module instantiation

```js

const {pinger, utils} = require('./src/pinger');

```

# Get your active interface info

```js

(async function(){
    const data = await utils.getDetails();
    console.log(data);
})();

```

## Ping a single host

```js
(async function() {
    console.log(await pinger.ping("192.168.1.1"))

    console.log(await pinger.ping("192.168.1.50"))
})()
```

## Ping sweep
```js
(async function() {
    const aliveHosts = await pinger.pingSweep("192.168.1.0/24") // If you didn't instantiate without a ip + CIDR

    /* 
        Sample output: ["192.168.1.1", "192.168.1.5"]
    */

})()
```

# TODO
* [x] Make the module more functional
* [x] Export all functionalities
* [x] Refactor Pinger class
