const Redis = require('redis');
const client = Redis.createClient();
client.connect();

let Set = async() => {
    console.time('Set');
    for (let k = 1; k <= 10000; k++) {
        await client.set(`incr${k}`, k);
    }
    console.timeEnd('Set');
}

let Del = async() => {
    console.time('Del');
    for (let k = 1; k <= 10000; k++) {
        await client.del(`incr${k}`);
    }
    console.timeEnd('Del');
}

let Incr = async() => {
    console.time('Incr');
    for (let k = 1; k <= 10000; k++) {
        await client.incr(`incr${k}`);
    }
    console.timeEnd('Incr');
}

let Decr = async() => {
    console.time('Decr');
    for (let k = 1; k <= 10000; k++) {
        await client.decr(`incr${k}`);
    }
    console.timeEnd('Decr');
}

client.on('connect', () => {console.log('Connect');});
client.on('ready', () => {
    console.log('Ready'); 
    Promise.resolve().then(Set()).then(Incr()).then(Decr()).then(Del())
});
client.on('end', () => {console.log('End');});
client.on('error', (err) => {console.log('Error ' + err);});
setTimeout(() => {client.quit();}, 5000)