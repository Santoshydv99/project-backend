import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = Schema(
    {
        userName : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
            index : true   
        },

        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
 
        },

        fullName : {
            type : String,
            required : true,
            trim : true,
            index : true   
        },

        avatar : {
            type : String,
            required : true,
        },

        coverImage : {
            type : String,
        },

        watchHistory  : [
            {
                type : Schema.Types.ObjectId,
                ref : "Video"
            }
        ],

        Password : {
            type : String,
            required : [true , "Password is required"]
        },

        refreshToken : {
            type : true
        }

    }, {timestamps : true}
)


userSchema.pre("save", async function (next){
    if(!this.modified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            userName : this.userName,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);