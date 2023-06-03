const tsRoute = require('express').Router();
const fs = require('fs');
let data = require('./db') || [];

tsRoute.get('/', (request, response) => {response.json(data);});

tsRoute.post('/', (request, response) => {
    const {id, name, phone} = request.body;
    const newTs = {id, name, phone};
    const targetTs = data.find(ts => ts.id === newTs.id);
    if (!targetTs) {
        data.push(newTs);
        fs.writeFileSync('./db.json', JSON.stringify(data))
        response.json(newTs);
    }
    response.status(400).end();
});

tsRoute.put('/', (request, response) => {
    const {id, name, phone} = request.body;
    const newTs = {id, name, phone};
    const targetTs = data.find(ts => ts.id === newTs.id);
    if (id && targetTs) {
        targetTs.name = name;
        targetTs.phone = phone;
        fs.writeFileSync('./db.json', JSON.stringify(data))
        response.json(targetTs);
    } else {
        response.status(400).end();
    }
});

tsRoute.delete('/', (request, response) => {
    const target = data.find(ts => ts.id === request.query.id);
    if (request.query.id && target) {
        data = data.filter((ts) => ts.id !== target.id);
        fs.writeFileSync('./db.json', JSON.stringify(data))
        response.json(data.find(ts => ts.id === request.query.id));
    } else {
        response.status(400).end();
    }
});


module.exports = tsRoute;
