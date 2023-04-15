let http = require('http');
const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()
const GET_handler =require("./handlers/getH");
const POST_handler =require("./handlers/postH");
const PUT_handler =require("./handlers/putH");
const DELETE_handler =require("./handlers/delH");

async function fluentAPI(){
    console.log(await prisma.Pulpit.findFirst({where: {faculty: 'ИЭФ'}}).Teacher());
}

async function transaction()
{
    try {
        await prisma.$transaction(async (prisma) => {
            await prisma.Auditorium.updateMany({data: {auditorium_capacity: {increment: 100}}})
            console.log(await prisma.Auditorium.findFirst());
            throw new Error
        })
    } catch (error) {
        console.log(await prisma.Auditorium.findFirst());
    }
}

let handler = (req, res) => {
    switch (req.method) {
        case 'GET':
            GET_handler(req, res);
            break;
        case 'POST':
            POST_handler(req, res);
            break;
        case 'PUT':
            PUT_handler(req, res);
            break;
        case 'DELETE':
            DELETE_handler(req, res);
            break;
        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

http.createServer().listen(3000, () => {
    console.log('server.listen(3000)');
    fluentAPI();
    setTimeout(()=>transaction(), 1000);
}).on('request', handler);