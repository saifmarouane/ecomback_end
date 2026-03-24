const express = require('express')
const router = express.Router()
const controller = require('./auth.controller')
const { authenticate, authorizeRoles, protectAdmin } = require('../../shared/middleware/auth.middleware')

router.post('/register', controller.registerClient)
router.post('/client/register', controller.registerClient)
router.post('/login', controller.login)
router.get('/me', authenticate, controller.me)
router.put('/client/profile', authenticate, authorizeRoles('client'), controller.updateClientProfile)
router.delete('/client/profile', authenticate, authorizeRoles('client'), controller.deleteClientProfile)

router.get('/admin/users', protectAdmin, controller.getAllUsers)
router.post('/admin/users', protectAdmin, controller.createUser)
router.put('/admin/users/:id', protectAdmin, controller.updateUser)
router.delete('/admin/users/:id', protectAdmin, controller.deleteUser)

module.exports = router
