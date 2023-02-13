const Redis = require('redis');
const client = Redis.createClient();
client.connect();

let Set = async() => {
    console.time('Set');
    for (let k = 1; k <= 10000; k++) {
        await client.set(`${k}`, `set${k}`);
    }
    console.timeEnd('Set');
}

let Get = async() => {
    console.time('Get');
    for (let k = 1; k <= 10000; k++) {
        await client.get(`${k}`);
    }
    console.timeEnd('Get');
}

let Del = async() => {
    console.time('Del');
    for (let k = 1; k <= 10000; k++) {
        await client.del(`${k}`);
    }
    console.timeEnd('Del');
}

client.on('connect', () => {console.log('Connect');});
client.on('ready', () => {
    console.log('Ready'); 
    Promise.resolve().then(Set()).then(Get()).then(Del())
});
client.on('end', () => {console.log('End');});
client.on('error', (err) => {console.log('Error ' + err);});
setTimeout(() => {client.quit();}, 5000)