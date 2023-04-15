const express = require('express')
const userController =require('../controllers/userController')

const UserRouter = express.Router()
UserRouter.get('/', userController.get)
UserRouter.post('/add', userController.add)
UserRouter.delete('/del', userController.del)
UserRouter.put('/upd', userController.upd)
UserRouter.get('/:id', userController.getget)

module.exports = UserRouter