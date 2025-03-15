import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    fullname:{type:String, required:true, lowercase:true, trim:true},
    username:{type:String, required:true, lowercase:true, trim:true},
    email:{type:String, required:true, lowercase:true, trim:true, index:true},
    password:{type:String, required:true},
    city:{type:String, lowercase:true, trim:true, default:""},
    refreshToken:{type:String, default:""}
},{timestamps:true})

//password hashing
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//password check
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//generate access token
userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id:this._id,
        username:this.username,
        email:this.email,
        fullname:this.fullname,
        city:this.city
    },process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

//generate refresh token
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id:this._id
    },process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = mongoose.model("User", userSchema)