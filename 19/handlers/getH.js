const url = require("url");
const http = require("http");
const fs = require("fs");
const errorHandler = require("./errH");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

let GET_handler = (req, res) => {
    let path = decodeURI(url.parse(req.url).pathname);
    pathParameters = path.split("/");
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    switch (true) {
        case path == "/api/pulpits/count":
            (async () => {
                let count = await prisma.Pulpit.count();
                res.end(count.toString());
            })()
            break;
        case path == "/api/faculties":
            prisma.faculty.findMany().then(faculties => res.end(JSON.stringify(faculties)))
                .catch((err) => { errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/pulpits":
            if (url.parse(req.url, true).query.page == undefined) {
                prisma.pulpit.findMany().then(pulpits => res.end(JSON.stringify(pulpits)))
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            } 
            else {
                (async () => {
                    let perPage = 10;
                    prisma.Pulpit.findMany({
                        skip: perPage * (url.parse(req.url, true).query.page - 1),
                        take: Math.min(perPage, await prisma.Pulpit.count() - perPage * (url.parse(req.url, true).query.page - 1)),
                        include: {_count: {select: {Teacher: true}}}})
                        .then(pulpits => res.end(JSON.stringify(pulpits)))
                        .catch((err) => {errorHandler(res, 2, 'Not Found');})
                    })()
                }
            break;
        case path == "/api/subjects":
            prisma.subject.findMany().then(subjects => res.end(JSON.stringify(subjects)))
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/teachers":
            prisma.teacher.findMany().then(teachers => res.end(JSON.stringify(teachers)))
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/auditoriumtypes":
            prisma.Auditorium_type.findMany().then(auditoriumstypes => res.end(JSON.stringify(auditoriumstypes)))
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/api/auditoriums": 
            prisma.Auditorium.findMany().then(auditoriums => res.end(JSON.stringify(auditoriums)))
                .catch((err) => {errorHandler(res, 2, 'Not Found');})
            break;
        case path == "/":
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            let page = fs.readFileSync('./index.html');
            res.end(page)
            break;
        case path == `/api/auditoriumtypes/${pathParameters[3]}/auditoriums`:
            prisma.Auditorium_type.findMany({where: {auditorium_type: pathParameters[3]},
                select: { auditorium_type: true ,Auditorium :{select : {auditorium:true}}}}) 
                .then((values) => {res.end(JSON.stringify(values));})
                .catch((err) => { errorHandler(res, 2, 'Not Found');
            });
            break;
        case path == `/api/faculty/${pathParameters[3]}/subjects`:
            prisma.Faculty.findMany({where: { faculty: pathParameters[3] },
                select: {faculty:true,
                Pulpit:{select: {pulpit:true, Subject:{select:{subject_name:true}}}}},})
            .then((values) => {res.end(JSON.stringify(values));})
            .catch((err) => {errorHandler(res, 2, 'Not Found');});
            break;    
        case path == "/api/auditoriumsWithComp1":
            prisma.Auditorium.findMany({where: { auditorium_type: 'ЛБ-К', auditorium:{contains: '-1'}}}) 
                .then((values) => {res.end(JSON.stringify(values));})
                .catch((err) => { errorHandler(res, 2, 'Not Found');
            });
            break;
        case path == "/api/puplitsWithoutTeachers":
            prisma.Pulpit.findMany(
                {select:{pulpit:true, Teacher:{select:{none:{}}}}})
                .then((values) => {
                    if (values !='')res.end(JSON.stringify(values));
                    else throw Error})
                .catch((err) => {errorHandler(res, 2, 'Not Found');});
            break;  
        case path == "/api/pulpitsWithVladimir":
            prisma.Pulpit.findMany({where: { Teacher:{some:{teacher_name:{contains: 'Владимир '}}}}})
                .then((values) => {res.end(JSON.stringify(values));})
                .catch((err) => {errorHandler(res, 2, 'Not Found');});
            break;   
        case path == "/api/auditoriumsSameCount":
            prisma.Auditorium.groupBy({by: ['auditorium_type', 'auditorium_capacity'], _count: true})
                .then((values) => {res.end(JSON.stringify(values));})
                .catch((err) => { errorHandler(res, 2, 'Not Found');
            });
            break;
        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

module.exports = GET_handler;