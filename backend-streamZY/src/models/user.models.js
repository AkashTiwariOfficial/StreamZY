import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,  // cloudinary url
            required: true
        },
        coverImage: {
            type: String // cloudinary url
        },
        watchHistory: [
            {
               video: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
                },
                watchedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
           savedVideos: [
            {
               video: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
                },
                savedAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        refreshToken: {
            type: String
        },
        public_id_avatar: {
            type: String
        },
        public_id_coverImage: {
            type: String
        },
        otp: {
            type: String,
            default: 0
        },
        expiryIn: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_JWT_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {

            _id: this._id,

        },
        process.env.REFRESH_JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_JWT_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateResetToken = function () {
    return jwt.sign(
        {

            _id: this._id,

        },
        process.env.RESET_JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.RESET_JWT_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);