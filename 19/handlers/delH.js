const url = require("url");
const http = require("http");
const fs = require("fs");
const errorHandler = require("./errH");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

let DELETE_handler = (req, res) => {
    let path = decodeURI(url.parse(req.url).pathname);
    pathParameters = path.split('/');
    let data_json  = '';
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    switch ('/api/' +pathParameters[2]) {
        case '/api/faculties':
            prisma.Faculty.findMany({where: {faculty: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {res.end(JSON.stringify(result));}
                    else {throw new Error();}
                    prisma.Faculty.delete({where: {faculty: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); });            
            break;
        case '/api/pulpits':
            prisma.Pulpit.findMany({where: {pulpit: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {res.end(JSON.stringify(result));}
                    else {throw new Error();}                    
                    prisma.Pulpit.delete({where: {pulpit: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); });            
            break;
        case '/api/subjects':
            prisma.Subject.findMany({where: {subject: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {res.end(JSON.stringify(result));}
                    else {throw new Error();}
                    prisma.Subject.delete({where: {subject: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;
        case '/api/teachers':
            prisma.Teacher.findMany({where: {teacher: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {res.end(JSON.stringify(result));}
                    else {throw new Error();}                    
                    prisma.Teacher.delete({where: {teacher: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3, 'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;
        case '/api/auditoriumstypes':
            prisma.Auditorium_type.findMany({where: {auditorium_type: pathParameters[3]}})
                .then(result => {  
                    if (result !='') {res.end(JSON.stringify(result));}
                    else {throw new Error();}  
                    prisma.Auditorium_type.delete({where: {auditorium_type: pathParameters[3]}})
                        .then(result => {
                            if (result == 1) {JSON.stringify('delete');}
                            else {throw new Error();}})
                        .catch(error => { errorHandler(res, 3,'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;
        case '/api/auditoriums':
            prisma.Auditorium.findMany({where: {auditorium: pathParameters[3]}})
            .then(result => {  
                if (result !='') {res.end(JSON.stringify(result));}
                else {throw new Error();}  
                prisma.Auditorium.delete({where: {auditorium: pathParameters[3]}})
                    .then(result => {
                        if (result == 1) {JSON.stringify('delete');}
                        else {throw new Error();}})
                    .catch(error => { errorHandler(res, 3,'Something wrong with delete'); } );})
                .catch(error => { errorHandler(res, 5, 'Not exist'); }); 
            break;
        default:
            res.end(JSON.stringify("method allow"))
            break;
    }
}

module.exports = DELETE_handler;