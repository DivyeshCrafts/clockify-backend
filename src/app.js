import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

//cors middleware
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//common middleware
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRoutes from "./routes/user.route.js"
import todoRoutes from "./routes/todo.route.js"

//user routes
app.use("/api/v1/users", userRoutes)

//todo routes
app.use("/api/v1/todos", todoRoutes)

export {app}