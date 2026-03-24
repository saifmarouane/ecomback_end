const express = require('express')
const router = express.Router()
const controller = require('./category.controller')
const { authenticate, authorizeRoles } = require('../../shared/middleware/auth.middleware')
const { upload } = require('../../shared/upload.middleware')
const { processCategoryImage } = require('../../shared/uploadCategory.middleware')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', authenticate, authorizeRoles('admin'), upload.single('image'), processCategoryImage, controller.create)
router.put('/:id', authenticate, authorizeRoles('admin'), upload.single('image'), processCategoryImage, controller.update)
router.delete('/:id', authenticate, authorizeRoles('admin'), controller.delete)

module.exports = router
