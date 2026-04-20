const accountModel = require("../models/account.model");

const CreateAccount = async (req, res) => {

    if (!req.user) {
        return res.status(400).json({
            message: "Bad Request"
        })
    }

    const account = await accountModel.create({
        user: req.user._id
    })

    res.status(201).json({
        message: "Account Create Successfully",
        AccountDets: {
            account
        }
    })

};

module.exports = { CreateAccount };
