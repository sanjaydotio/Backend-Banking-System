const express = require('express')
const route = express.Router()

const transactionController = require("../controllers/transaction.controller")

route.post("/createtransaction", transactionController.createTransaction)



module.exports = route