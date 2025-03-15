import {asyncHandler} from "../utils/asyncHendler.js"
import {ApiError} from "../utils/apiError.js"
import {User} from "../models/user.model.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {generateAccessAndRefreshToken} from "../utils/tokensUtils.js"

const registration = asyncHandler(async (req, res)=>{

    const {username, email, password, fullname, city} = req.body
    //input validation
    // if([username, email, password, fullname].some((field)=>field.trim()==="")){
    //     throw new ApiError(400, "All feilds are required")
    // }
    const existuser = await User.findOne({$or:[{username},{email}]})
    if(existuser){
        throw new ApiError(409, "User with username and email alread exists")
    }
    const user = await User.create({username, email, password, fullname, city})
    const createuser = await User.findById(user._id).select("-password -refreshToken")
    if(!createuser){
        throw new ApiError(500, "Something went wrong while registeration a user")
    }
    return res.status(201).json(new ApiResponse(200, createuser, "User registed successfully"))
})

const login = asyncHandler(async (req, res)=>{
    const {email, password} = req.body
    //validation
    if([email, password].some((field)=>{field.trim()===""})){
        throw new ApiError(400, "Email and Password required")
    }
    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User not found")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "invalid password")
    }
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id) 
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")
    if(!loggedUser){
        throw new ApiError(404, "Logged user not found")
    }
    const option = {
        httpOnly: true,
        secure: process.env.NODE_ENV = "production"
    }
    return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(new ApiResponse(200, loggedUser, "User logged successfully"))
})

const logout = asyncHandler(async (req, res)=>{
    const user = await User.findByIdAndUpdate(req.user._id, {$set:{refreshToken:""}}, {new:true})
    const option = {
        httpOnly:true,
        secure: process.env.NODE_ENV == "production"
    }
    return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "User logged out successfully"))
})

export {registration, login, logout}