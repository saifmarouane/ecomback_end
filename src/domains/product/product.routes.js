const express = require('express')
const router = express.Router()
const controller = require('./product.controller')
const { authenticate, authorizeRoles } = require('../../shared/middleware/auth.middleware')
const { upload, processImages } = require('../../shared/upload.middleware')

router.get('/', controller.getProducts)
router.get('/:id', controller.getProductById)
router.post('/', authenticate, authorizeRoles('admin'), upload.fields([
  { name: 'imageLarge', maxCount: 1 },
  { name: 'imageSmall', maxCount: 1 }
]), processImages, controller.createProduct)
router.put('/:id', authenticate, authorizeRoles('admin'), upload.fields([
  { name: 'imageLarge', maxCount: 1 },
  { name: 'imageSmall', maxCount: 1 }
]), processImages, controller.updateProduct)
router.delete('/:id', authenticate, authorizeRoles('admin'), controller.deleteProduct)

module.exports = router