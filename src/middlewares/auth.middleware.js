import { User } from "../models/user.model.js"
import { ApiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHendler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, _, next)=>{
    const token = req.cookies.accessToken || req.headers.authorization?.replace("Bearer ", "")
    if(!token){
        throw new ApiError(401, "Unauthorized")
    }
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user){
            throw new ApiError(401, "Unauthorized")
        }
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export {verifyJWT}