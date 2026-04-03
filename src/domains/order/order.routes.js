const express = require('express')
const router = express.Router()
const controller = require('./order.controller')
const { protectAdmin } = require('../../shared/middleware/auth.middleware')

router.get('/', protectAdmin, controller.listOrders)
router.get('/stats', protectAdmin, controller.stats)
router.get('/:id', protectAdmin, controller.getOrderById)
router.put('/:id/status', protectAdmin, controller.updateOrderStatus)
router.put('/:id/comment', protectAdmin, controller.updateOrderComment)

module.exports = router
