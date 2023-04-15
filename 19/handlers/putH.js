const url = require("url");
const http = require("http");
const fs = require("fs");
const errorHandler = require("./errH");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

let PUT_handler = (req, res) => {
    let data_json = '';
    let path = decodeURI(url.parse(req.url).pathname);
    pathParameters = path.split('/');
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    switch (true) {
        case path =='/api/faculties':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Faculty.update({data:{faculty_name: data_json.faculty_name}, where:{faculty: data_json.faculty}})
                        .then((affectedRows) => {
                            if (affectedRows[0] === 0) {throw new Error('Something wrong with update');}
                            else {res.end(JSON.stringify(data_json ));}
                    })
                    .catch(error => { errorHandler(res, 4, error); });    
                });
            break;
        case path =='/api/pulpits':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Pulpit.update({data:{pulpit_name: data_json.pulpit_name}, where: {pulpit: data_json.pulpit}})
                        .then((affectedRows) => {
                            if (affectedRows[0] === 0) {throw new Error('Something wrong with update');}
                            else {res.end(JSON.stringify(data_json ));}
                    })
                    .catch(error => { errorHandler(res, 4, error); });    
                });
            break;
        case path== '/api/subjects':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Subject.update({data:{subject_name: data_json.subject_name}, where: {subject: data_json.subject}})
                        .then((affectedRows) => {
                            if (affectedRows[0] === 0) {throw new Error('Something wrong with update');}
                            else {res.end(JSON.stringify(data_json ));}
                    })
                    .catch(error => { errorHandler(res, 4, error); });    
                });
            break;
        case path== '/api/teachers':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Teacher.update({data:{teacher_name: data_json.teacher_name}, where: {teacher: data_json.teacher}})
                        .then((affectedRows) => {
                            if (affectedRows[0] === 0) {throw new Error('Something wrong with update');}
                            else {res.end(JSON.stringify(data_json ));}
                    })
                    .catch(error => { errorHandler(res, 4, error); });    
                });
            break;
        case path == '/api/auditoriumstypes':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Auditorium_type.update({data:{auditorium_typename: data_json.auditorium_typename},
                            where: {auditorium_type: data_json.auditorium_type}})
                        .then((affectedRows) => {
                            if (affectedRows[0] === 0) {throw new Error('Something wrong with update');}
                            else {res.end(JSON.stringify(data_json ));}
                        })
                        .catch(error => { errorHandler(res, 4, error); });    
                });
            break;
        case path =='/api/auditoriums':
            req.on('data', chunk => {data_json += chunk;});
            req.on('end', () => {
                data_json = JSON.parse(data_json);
                    prisma.Auditorium.update({data:{ 
                        auditorium_name: data_json.auditorium_name,
                        auditorium_capacity: data_json.auditorium_capacity
                    }, where: {auditorium: data_json.auditorium}})
                        .then((affectedRows) => {
                            if (affectedRows[0] === 0) {throw new Error('Something wrong with update');}
                            else {res.end(JSON.stringify(data_json ));}
                    })
                    .catch(error => { errorHandler(res, 4, error); });    
                });
            break;
        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

module.exports = PUT_handler;