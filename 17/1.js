const Redis = require('redis');
const client = Redis.createClient();

client.connect();
client.on('error', (err) => {console.log('Error ' + err);});
client.on('connect', () => {console.log('Connect');});
client.on('ready', () => {console.log('Ready');});
client.on('end', () => {console.log('End');});

setTimeout(() => {client.quit();}, 5000);