const redis = require('redis');
const sub = redis.createClient();

let listener = (message, channel) => {
    console.log(channel + ': ' + message);
    sub.unsubscribe('channel', listener);
    sub.quit();
}

( async () => {
    sub.on('error', err => console.log('error', err));
    sub.on('end', () => console.log('end'));
    await sub.connect().then(() => console.log('connected'));
    await sub.subscribe('channel', listener);
})();