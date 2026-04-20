const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')

const RegisterAPI = async (req,res) => {
    const {userName , fullName , email , password} = req.body

    if (!userName || !email || !password){
        return res.status(401).json({
            message: "Fields is Empty"
        })
    }

    const isExistsUser = await userModel.findOne({
        $or: [
            {userName} , {email}
        ]
    })

    if (isExistsUser) {
      return  res.status(409).json({
            message: "User is already exists with this userName or email"
        })
    }

    const user = await userModel.create({
        userName,
        email,
        fullName,
        password
    })

    const token = jwt.sign({
        _id: user._id
    }, process.env.JWT_SECRET_KEY)

    res.cookie("token", token)
    
    
    res.status(201).json({
        message: "User Created Successfully",
        userData: {
            userName: user.userName,
            fullName: user.fullName,
            email: user.email
        },
        token
    })
    
    await emailService.sendRegistrationEmail(user.email , user.fullName)
    
}

const LoginApi = async (req,res) => {
    const {userName , email , password} = req.body

    const isUserExsits = await userModel.findOne({
        $or: [{userName} , {email}]
    })

    if (!isUserExsits){
        return res.status(400).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await isUserExsits.isPasswordCorrect(password , isUserExsits.password)

    
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid Credentials"
        })
    }

    const token = jwt.sign({
        _id: isUserExsits._id
    },process.env.JWT_SECRET_KEY)

    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in Successfully",
        userData: {
            userName: isUserExsits.userName,
            email: isUserExsits.email,
            fullName: isUserExsits.fullName
        },
        token
    })
}

module.exports = {RegisterAPI , LoginApi}