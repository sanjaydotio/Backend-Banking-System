const transactionModel = require("../models/transaction.model");
const accountModel = require("../models/account.model");
const mongoose = require("mongoose");
const ledgerModel = require("../models/ledger.model");

const createTransaction = async (req, res) => {

  const { fromAccount, toAccount, amount, idempotencyKey } = req.body

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    res.status(401).json({
      message: "All field are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETE") {
      return res.status(200).json({
        message: "Transaction Already Completed",
      });
    }
    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction is Failed",
      });
    }
    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction is Reversed",
      });
    }
    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is pending",
      });
    }
  }

  if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE") {
    return res.status(400).json({
      message: "Make sure accoun must be Activated",
    });
  }

  const balance = fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(401).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount is ${amount} `,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccout: fromUserAccount,
      toAccount: toUserAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETE";
  await transaction.save({ session });

  await session.commitTransaction()
  session.endSession
};


module.exports = {createTransaction}