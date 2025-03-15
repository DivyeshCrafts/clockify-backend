import mongoose from "mongoose"
import {DB_NAME} from "../constants.js"

const db_connect = async ()=>{
    try {
        const connected = await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
        console.log(`\nMongobd connected, host:${connected.connection.host}`)
    } catch (error) {
        console.log("Mongodb connection error")
        process.exit(1)
    }
}

export {db_connect}