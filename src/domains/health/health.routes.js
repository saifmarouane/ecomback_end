const express = require('express')
const router = express.Router()
const controller = require('./health.controller')

router.get('/db', controller.dbHealth)

module.exports = router

