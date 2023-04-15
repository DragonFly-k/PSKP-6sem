const url = require("url");
const http = require("http");
const fs = require("fs");
const errorHandler = require("./errH");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

let POST_handler = (req, res) => {
    let data_json = '';
    let path = decodeURI(url.parse(req.url).pathname);
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    switch (true) {
        case path == '/api/faculties':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                prisma.Faculty.create({data: {
                        faculty: data_json.faculty, 
                        faculty_name: data_json.faculty_name,
                        Pulpit: {create: data_json.pulpits,},
                    },include: {Pulpit: true,},})
                    .then(faculty => res.end(JSON.stringify(faculty)))
                    .catch((err) => {errorHandler(res, 3, 'Such faculty exist');
                })})
            break;
        case path == '/api/pulpits':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                prisma.Pulpit.create({data: {
                        pulpit: data_json.pulpit,
                        pulpit_name: data_json.pulpit_name,
                        Faculty: {connectOrCreate: {
                            where: { faculty: data_json.faculty },
                            create: {faculty: data_json.faculty,faculty_name: data_json.faculty_name
                        },},},},})
                    .then(pulpit => res.end(JSON.stringify(pulpit)))
                    .catch((err) => {errorHandler(res, 3, 'Such pulpit exist');})
                })
            break;
        case path == '/api/subjects':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Subject.create({data:{ 
                        subject: data_json.subject,
                        subject_name: data_json.subject_name,
                        pulpit: data_json.pulpit
                    }})
                        .then(subject => res.end(JSON.stringify(subject)))
                        .catch((err) => {errorHandler(res, 3, 'Such subject exist');})
                });
            break;
        case path == '/api/teachers':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Teacher.create({data:{ 
                        teacher: data_json.teacher,
                        teacher_name: data_json.teacher_name,
                        pulpit: data_json.pulpit
                    }})
                        .then(teacher => res.end(JSON.stringify(teacher)))
                        .catch((err) => {errorHandler(res, 3,'Such teacher  exist');})
                });
            break;
        case path == '/api/auditoriumstypes':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Auditorium_type.create({data:{
                        auditorium_type: data_json.auditorium_type,
                        auditorium_typename: data_json.auditorium_typename
                    }})
                        .then(subject => res.end(JSON.stringify(subject)))
                        .catch((err) => {errorHandler(res, 3, 'Such auditorium type exist');})
                });
            break;
        case path == '/api/auditoriums':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Auditorium.create({data:{
                        auditorium: data_json.auditorium,
                        auditorium_name: data_json.auditorium_name,
                        auditorium_capacity: data_json.auditorium_capacity,
                        auditorium_type: data_json.auditorium_type
                    }})
                        .then(subject => res.end(JSON.stringify(subject)))
                        .catch((err) => {errorHandler(res, 3, 'Such auditorium  exist');})
                });
            break;
            default:
                res.end(JSON.stringify("method allow"))
                break;
    }
}

module.exports = POST_handler;