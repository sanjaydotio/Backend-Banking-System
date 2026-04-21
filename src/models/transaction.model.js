const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    fromAccout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING" , "COMPLETE" , "REVERSED" , "FAILED"]
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        minLenght: 1
    },
    idempotencyKey: {
        type: String,
        required: true,
        index: true,
        unique: true
    }
})

const transactionModel = mongoose.model("transaction", transactionSchema)


module.exports = transactionModel