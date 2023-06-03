const express = require('express');
const app = express();
const fs = require('fs');
app.use('/', express.static('.'));
app.get('/1', (req, res) => {res.sendFile(__dirname + '/1.html');});
app.get('/2', (req, res) => {res.sendFile(__dirname + '/2.html');});

let wasmCode = fs.readFileSync('./p.wasm');
let wasmImport = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.get('/3', (req, res, next)=>{
    res.type('html').send(
        `sum(4,5) = ${wasmInstance.exports.sum(4,5)}<br>` +  
        `mul(4,5) = ${wasmInstance.exports.mul(4,5)}<br>` +
        `sub(9,3) = ${wasmInstance.exports.sub(9,3)}<br>`
    )
});

app.listen(3000);