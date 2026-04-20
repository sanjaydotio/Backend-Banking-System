const jwt = require('jsonwebtoken')
const userModel = require('../models/user.model')

const isLogin = async (req,res,next) => {
    const token = req.cookies.token

    if (!token){
       return res.status(401)
        .json({
            message: "Invalid Request Token is Missing"
        })
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)

    if (!decoded) {
       return res.status(401).json({
            message: "Unauthorized Request Token is Invalid"
        })
    }

    const user = await userModel.findById(decoded._id)
    req.user = user
    
    next()
}

module.exports = {isLogin}