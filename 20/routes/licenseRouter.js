const express = require('express')
const licController =require('../controllers/licenseController')

const LicenseRouter = express.Router()
LicenseRouter.get('/', licController.get)
LicenseRouter.post('/add', licController.add)
LicenseRouter.delete('/del', licController.del)
LicenseRouter.put('/upd', licController.upd)
LicenseRouter.get('/:id', licController.getget)

module.exports = LicenseRouter