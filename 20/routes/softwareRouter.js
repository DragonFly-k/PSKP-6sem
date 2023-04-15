const express = require('express')
const softController =require('../controllers/softwareController')

const SoftwareRouter = express.Router()
SoftwareRouter.get('/', softController.get)
SoftwareRouter.post('/add', softController.add)
SoftwareRouter.delete('/del', softController.del)
SoftwareRouter.put('/upd', softController.upd)
SoftwareRouter.get('/:id', softController.getget)

module.exports = SoftwareRouter