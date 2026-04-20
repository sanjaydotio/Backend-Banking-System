require('dotenv').config()
const server = require('./src/app')
const ConnectDB = require('./src/db/db')

ConnectDB()
.then(() => {
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at PORT ${process.env.PORT}`)
    })
})
.catch(() => {
    console.log("Database Connection Problem")
})

