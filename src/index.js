import "dotenv/config"
import {app} from "./app.js"
import {db_connect} from "./database/databaseConnection.js"
const PORT = process.env.PORT || 8000

db_connect()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`)
    })
})
.catch((error)=>{
    console.log("Mongodb connection error", error)
    process.exit(1)
})