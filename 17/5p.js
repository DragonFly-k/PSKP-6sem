const redis = require('redis');
const pub = redis.createClient();

( async () => {
    await pub.connect().then(() => console.log('connected'));
    await pub.publish('channel', 'message').then(() => console.log('message published'));
    pub.on('end',()=>{console.log('end')});
    pub.on('error',()=>{console.log('error')});
    pub.quit();
})();