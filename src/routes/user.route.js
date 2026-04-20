const express = require('express')

const router = express()

/**
 * Require Controllers
 */

const userController = require('../controllers/user.controller')

/**
 * Use Controllers
 */
router.post("/register", userController.RegisterAPI)
router.post("/login", userController.LoginApi)

module.exports = router