const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/**
 * Require Routes
 */
const authRoute = require('./routes/user.route')
const accountroute = require('./routes/account.route')
/**
 * Use Routes
 */
app.use("/auth/api/v1", authRoute)
app.use("/auth/api/v2/accounts", accountroute)

module.exports = app