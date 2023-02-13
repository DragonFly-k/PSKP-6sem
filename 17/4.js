const Redis = require('redis');
const client = Redis.createClient();
client.connect();

let hSet = async() => {
    console.time('hSet');
    for (let k = 1; k <= 10000; k++) {
        await client.hSet(`${k}`,`${k}`,JSON.stringify({id: `${k}`, val: `val-${k}`}));
    }
    console.timeEnd('hSet');
}

let hGet = async() => {
    console.time('hGet');
    for (let k = 1; k <= 10000; k++) {
        await client.hGet(`${k}`,`${k}`);
    }
    console.timeEnd('hGet');
}

let hDel = async() => {
    console.time('hDel');
    for (let k = 1; k <= 10000; k++) {
        await client.hDel(`${k}`,`${k}`);
    }
    console.timeEnd('hDel');
}

client.on('connect', () => {console.log('Connect');});
client.on('ready', () => {
    console.log('Ready'); 
    Promise.resolve().then(hSet()).then(hGet()).then(hDel())
});
client.on('end', () => {console.log('End');});
client.on('error', (err) => {console.log('Error ' + err);});
setTimeout(() => {client.quit();},5000)

