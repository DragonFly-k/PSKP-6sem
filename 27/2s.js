const {ServerSign} = require('./2m');
const fs=require('fs');
const app = require('express')();
let rs=fs.createReadStream('./file.txt');

app.get('/', (req, res, next) => {
    const ss = new ServerSign();
    ss.getSignContext(rs, (signcontext) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(signcontext));
    });
});  

app.get('/resource',(req,res,next)=>
{
	res.statusCode=200;
	let rs2=fs.createReadStream('./file.txt');
	rs2.pipe(res);
	rs2.on('close',()=>{res.end();});
});

app.listen(8000);