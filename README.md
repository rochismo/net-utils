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



## Sample usage

# Module instantiation

```js

const {Pinger, getDetails} = require('./src/pinger');
const pingerInstance = new Pinger();

```

# Get your active interface info

```js

(async function(){
    const data = await getDetails();
    console.log(data);
})();

```

Sample output
```json
{ ip_cidr: '172.16.0.210/20', gatewayMac: 'd4:ca:6d:3a:b0:a4' }
```

## Ping a single host

```js
(async function() {
    console.log(await pingerInstance.ping("192.168.1.1"))
    //Output: 172.16.7.11 (if it's alive it will return the ip address)

    console.log(await pingerInstance.ping("192.168.1.50"))
    //Output: false (Boolean, if it's not alive it will return false)
})()
```

## Ping sweep
```js
(async function() {
    const aliveHosts = await pingerInstance.pingSweep("192.168.1.0/24") // If you didn't instantiate without a ip + CIDR

    /* 
        Sample output: ["192.168.1.1", "192.168.1.5"]
    */

})()
```

# TODO
* [] Make the module more functional
* [] Export all functionalities
* [] Refactor Pinger class
