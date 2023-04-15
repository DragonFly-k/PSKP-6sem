const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const express = require('express')
const app = express()

exports.add = async (request, response, next) => {
try {
    const body = request.body
    await prisma.licenses.create({ data: { SoftwareID: parseInt(body.SoftwareID),Price: parseInt(body.Price)}})
    response.redirect('/license')
} catch (err) {
    next(`Error adding license`)
}
}

exports.get = async  (request, response, next) => {
  try {
    const licenses = await prisma.licenses.findMany()
    response.render('license.hbs', { license: licenses })
  } catch (err) {
    next(`Error retrieving licenses`)
  }
}

exports.getget = async  (request, response, next) => {
  try {
    const { id } = request.params
    const license = await prisma.licenses.findUnique({where: { ID: parseInt(id) }})
    if (!license) { throw new Error('License not found')}
    response.render('license.hbs', { us: license })
  } catch (err) {
    next(`Error retrieving license ${err.message}`)
  }
}

exports.del = async (request, response, next) => {
  try {
    const body = request.body
    const license = await prisma.licenses.delete({where: { ID: parseInt(body.ID) }})
    if (!license) {throw new Error()}
    response.redirect('/license')
  } catch (err) {
    response.statusCode = 400;
    response.statusMessage = `License not found`
    response.end()
  }
}

exports.upd = async  (request, response, next) => {
  try {
    const body = request.body
    const license = await prisma.licenses.update({
      data: { Price: parseInt(body.Price) },
      where: { ID: parseInt(body.ID) }
    })
    if (!license) {throw new Error()} 
    response.redirect('/license')
  } catch (err) {
    response.statusCode = 400;
    response.statusMessage = `License not found`
    response.end()
  }
}
