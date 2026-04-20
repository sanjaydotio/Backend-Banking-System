const mongoose = require('mongoose')


const ConnectDB = async () => {
    try {
       const response = await mongoose.connect(`${process.env.MONGODB_URI}Backend-Ledger`)
       console.log(`Databse Connected Successfully ${response.connection.host}`)
    } catch (error) {
        console.log(`Database Connection Error ${error}`)
    }
}

module.exports = ConnectDB