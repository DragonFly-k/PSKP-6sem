const express = require('express');
const app = express()
const https = require('https');
const fs = require('fs');

let options = {
    key: fs.readFileSync('D:/универ/Пскп/лаба/26/LAB.key').toString(),
    cert: fs.readFileSync('D:/универ/Пскп/лаба/26/LAB.crt').toString()
};

app.get('/', (req, res) =>{res.send("hello from https")})

https.createServer(options, app).listen(3000, () =>
{
    console.log(`https://localhost:3000/`);
    console.log(`https://sed:3000/`);
});