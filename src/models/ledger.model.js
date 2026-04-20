const mongoose = require('mongoose')

const  ledgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: true,
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: true,
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["CREDIT","DEBIT"]
        },
        required: true,
        immutable: true
    }
})

function PreventLedgerModification () {
    throw new Error("ledger entries are immutable and cannot be modified")
}

ledgerSchema.pre("findOneAndDelete", PreventLedgerModification)
ledgerSchema.pre("findOneAndReplace", PreventLedgerModification)
ledgerSchema.pre("findOneAndUpdate", PreventLedgerModification)
ledgerSchema.pre("deleteMany", PreventLedgerModification)
ledgerSchema.pre("deleteOne", PreventLedgerModification)
ledgerSchema.pre("updateMany", PreventLedgerModification)
ledgerSchema.pre("updateOne", PreventLedgerModification)
ledgerSchema.pre("replaceOne", PreventLedgerModification)

const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel