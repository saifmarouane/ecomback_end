const express = require('express')
const router = express.Router()
const controller = require('./cart.controller')
const { authenticate, authorizeRoles } = require('../../shared/middleware/auth.middleware')

router.get('/', authenticate, authorizeRoles('client', 'admin'), controller.getMyCart)
router.post('/items', authenticate, authorizeRoles('client', 'admin'), controller.addItem)
router.put('/items/:id', authenticate, authorizeRoles('client', 'admin'), controller.updateItem)
router.delete('/items/:id', authenticate, authorizeRoles('client', 'admin'), controller.removeItem)
router.post('/clear', authenticate, authorizeRoles('client', 'admin'), controller.clear)

module.exports = router

