const express = require('express')
const route = express.Router()

/**
 * Require controllers
 */

const accountController = require('../controllers/account.controller')

/**
 * Require Middlewares
 */

const authMiddleware = require('../middlewares/auth.middleware')

/**
 * Use Controllers
 */

route.post("/create", authMiddleware.isLogin , accountController.CreateAccount)



module.exports = route