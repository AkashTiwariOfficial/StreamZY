import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponses } from "../utils/ApiResponses.js"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt"
import mongoose from "mongoose";
import { Video } from "../models/video.models.js";



const generateAccessTokenandRefreshToken = async (userId) => {

  try {

    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new Error(500, "Internal Server Error while generating Access and Refresh Tokens")
  }
}


const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // check validation wheather following inputs are not empty
  // check if username or email already exists
  // check for images and check for avatar
  // upload file and avatar to cloudinary, avatar
  // create user object - create entry in mongoDB
  // remove password and jwt_token field from response
  // check for response
  // check for user creation 
  // return res

  const { fullName, username, email, password } = req.body

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiErrors(400, "All fields are required.")
  }
  if (!/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    throw new ApiErrors(400, "Invalid email format")
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (userExists) {
    throw new ApiErrors(409, "User with email or username already Exists");
  }

  const avatarFilePath = req.files?.avatar[0]?.path;

  let coverImageFilePath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageFilePath = req.files.coverImage[0].path
  }

  if (!avatarFilePath) {
    throw new ApiErrors(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarFilePath);
  const coverImage = await uploadOnCloudinary(coverImageFilePath);

  if (!avatar) {
    throw new ApiErrors(400, "Avatar file is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
    public_id_avatar: avatar.public_id,
    public_id_coverImage: coverImage?.public_id || "",
  });

    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id);

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!userCreated) {
    throw new ApiErrors(500, "Internal Server Error! while registering a new user. Please Try Again");
  }

  return res.status(201).json(
    new ApiResponses(200, {userCreated, accessToken}, "User registered successfully")
  )

})


const loginUser = asyncHandler(async (req, res) => {
  // req.body -> data
  // login through username or email
  // find user
  // check password
  // access and resfresh Tokens
  // send cookies

  const { username, email, password } = req.body

  if (!(username || email)) {
    throw new ApiErrors(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiErrors(404, "User does not exists");
  }

  const passwordCorrect = await user.isPasswordCorrect(password);

  if (!passwordCorrect) {
    throw new ApiErrors(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(user._id)

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponses(200,
        {
          data: loggedUser, accessToken, refreshToken
        }
        , "User logged In Successfully")
    )

})


const logoutUser = asyncHandler(async (req, res) => {

  await User.findByIdAndUpdate(req.user._id,
    {
      $unset: {
        refreshToken: 1
      }
    },
    {
      new: true
    }
  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res.
    status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponses(200, {}, "User logged out successfully"))

})


const refreshAccessandRefreshTokens = asyncHandler(async (req, res) => {

  const { refreshToken } = req.body

  const incoming = req.cookies?.refreshToken || refreshToken

  const incomingRefreshToken = incoming?.trim();

  if (!incomingRefreshToken) {
    throw new ApiErrors(401, "Unauthorized Access! Access Denied")
  }

  console.log(incomingRefreshToken)

  try {
    const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_JWT_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)

    if (!user) {
      throw new ApiErrors(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiErrors(401, "Refresh token is either expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true
    }

    const { accessToken, newrefreshToken } = await generateAccessTokenandRefreshToken(user._id)

    return res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", newrefreshToken, options)
      .json(
        new ApiErrors(200, {
          accessToken,
          refreshToken: newrefreshToken
        },
          "Access Token refreshed successfully"
        )
      )
  } catch (error) {
    throw new ApiErrors(500, error?.message || "Invaild refersh token");
  }
})

const changePassword = asyncHandler(async (req, res) => {

  const { oldPassword, newPassword } = req.body

  if (!(oldPassword || newPassword)) {
    throw new ApiErrors(400, "Both fields are required");
  }

  try {
    const user = await User.findById(req.user?._id)
    const ispasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!ispasswordCorrect) {
      throw new ApiErrors(400, "Invalid password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false })

    return res
      .status(200)
      .json(new ApiResponses(200, {}, "Password was changed Successfully"))
  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while changing password");
  }
})


const getCurrentUser = asyncHandler(async (req, res) => {

  try {
    const user = await User.findById(req.user?._id).select(
      "-password -refreshToken"
    )

    if (!user) {
      throw new ApiErrors(404, "User not does exists");
    }

    return res
      .status(200)
      .json(new ApiResponses(200, { user }, "Current user fetched successfully"))
  } catch (error) {
    throw new ApiErrors(500, "Internal Server Error")
  }

})


const updateAccountDetails = asyncHandler(async (req, res) => {

  const { fullName, email, username } = req.body

  if (!(fullName || email || username)) {
    throw new ApiErrors(400, "Atleast one field is required")
  }

  try {
    const user = await User.findByIdAndUpdate(req.user?._id,
      {
        $set: {
          fullName,
          email,
          username
        }
      },
      { new: true }
    ).select(
      "-password -refreshToken"
    )

    return res
      .status(200)
      .json(new ApiResponses(200, user, "Account details updated successfully"))
  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while updating Account details");
  }

})


const upadteAvatar = asyncHandler(async (req, res) => {


  const newAvatarFilePath = req.file?.path

  if (!newAvatarFilePath) {
    throw new ApiErrors(400, "Avatar file is missing");
  }

  try {
    const avatar = await uploadOnCloudinary(newAvatarFilePath)

    if (!avatar.url) {
      throw new ApiErrors(400, "Error while updating and uploading Avatar on cloudinary")
    }

    try {
      if (req.user?.public_id_avatar) {
        await deleteFromCloudinary(req.user?.public_id_avatar)
      }
    } catch (error) {
      await deleteFromCloudinary(avatar.public_id)
      throw new ApiErrors(500, "Failed to delete old avatar, rollback new upload")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
      {
        $set: {
          avatar: avatar.url,
          public_id_avatar: avatar.public_id
        }
      }, { new: true }
    ).select(
      "-password -refreshToken")

    return res
      .status(200)
      .json(new ApiResponses(200, user, "Avatar file updated successfully"))
  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while updating Avatar file")
  }

})


const upadtecoverImage = asyncHandler(async (req, res) => {

  const coverImageLocalPath = req.file?.path

  if (!coverImageLocalPath) {
    throw new ApiErrors(400, "coverImage file is missing");
  }

  try {
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
      throw new ApiErrors(400, "Error while updating and uploading coverImage on cloudinary")
    }

    try {
      if (req.user?.public_id_coverImage) {
        await deleteFromCloudinary(req.user?.public_id_coverImage)
      }
    } catch (error) {
      await deleteFromCloudinary(coverImage.public_id)
      throw new ApiErrors(500, "Failed to delete old coverImage, rollback new upload")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
      {
        $set: {
          coverImage: coverImage.url,
          public_id_coverImage: coverImage.public_id
        }
      }, { new: true }
    ).select(
      "-password -refreshToken")

    return res
      .status(200)
      .json(new ApiResponses(200, user, "coverImage file updated successfully"))
  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while updating coverImage file")
  }

})


const deleteAccount = asyncHandler(async (req, res) => {

  try {
    const deletedAccount = await User.findByIdAndDelete(req.user?._id)

    if (!deletedAccount) {
      throw new ApiErrors(404, "User not found")
    }

    return res
      .status(200)
      .json(new ApiResponses(200, {}, "Account has been deleted successfully"))
  } catch (error) {
    throw new ApiErrors(500, "Internal Server Error while deleting user account" || error.message)
  }

})


const generateOtp = () => {

  const otp = Math.floor(100000 + (Math.random() * 100000))
  const expiryIn = (Date.now() + (10 * 60 * 1000))
  const expireTime = new Date(expiryIn)
  const expTime = expireTime.toISOString()

  return { otp, expiryIn, expTime }
}


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_APP,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});


const sendOtp = asyncHandler(async (req, res) => {

   const { username, email} = req.body

  if (!(username || email)) {
    throw new ApiErrors(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiErrors(404, "User does not exists");
  }

  const { otp, expiryIn, expTime } = generateOtp()

  if (!(otp && expiryIn)) {
    throw new ApiErrors(400, "Error while generating OTP");
  }

  try {

    const users = await User.findById(req.user?._id)

    try {

      await transporter.sendMail({
        from: "noreply@StreamZY.com",
        to: users.email,
        subject: "Your OTP Code",
        html: `
      <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px">
        <p style="padding-top: 14px; border-top: 1px solid #eaeaea">
          To authenticate, please use the following One Time Password (OTP):
        </p>
        <p style="font-size: 22px"><strong>${otp}</strong></p>
        <p>This OTP will be valid for 10 minutes till <strong>${expTime}</strong>.</p>
        <p>
          Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this
          email.<br />StreamZY will never contact you about this email or ask for any login codes or
          links. Beware of phishing scams.
        </p>
        <p>Thanks for visiting StreamZY!</p>
      </div>
    `
      });
    } catch (error) {
      throw new ApiErrors(400, error.message || "Sending of email failed");
    }

    const newOtp = await bcrypt.hash(otp.toString(), 10)

    const user = await User.findByIdAndUpdate(req.user?._id,
      {
        $set: {
          otp: newOtp,
          expiryIn: expiryIn,
        }
      }, { new: true }
    )

    return res
      .status(200)
      .json(new ApiResponses(200, {}, "Otp sent Through Email to user"))

  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while sending otp to user");
  }

})

const sendOtpforgotpassword = asyncHandler(async (req, res) => {

 const { username, email} = req.body

  if (!(username || email)) {
    throw new ApiErrors(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiErrors(404, "User does not exists");
  }

  const { otp, expiryIn, expTime } = generateOtp()

  if (!(otp && expiryIn)) {
    throw new ApiErrors(400, "Error while generating OTP");
  }

  try {

    const users = await User.findById(user._id)

    try {

      await transporter.sendMail({
        from: "noreply@StreamZY.com",
        to: users.email,
        subject: "Your OTP Code",
        html: `
      <div style="font-family: system-ui, sans-serif, Arial; font-size: 14px">
        <p style="padding-top: 14px; border-top: 1px solid #eaeaea">
          To authenticate, please use the following One Time Password (OTP):
        </p>
        <p style="font-size: 22px"><strong>${otp}</strong></p>
        <p>This OTP will be valid for 10 minutes till <strong>${expTime}</strong>.</p>
        <p>
          Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this
          email.<br />StreamZY will never contact you about this email or ask for any login codes or
          links. Beware of phishing scams.
        </p>
        <p>Thanks for visiting StreamZY!</p>
      </div>
    `
      });
    } catch (error) {
      throw new ApiErrors(400, error.message || "Sending of email failed");
    }

    const newOtp = await bcrypt.hash(otp.toString(), 10)

       await User.findByIdAndUpdate(user._id,
      {
        $set: {
          otp: newOtp,
          expiryIn: expiryIn,
        }
      }, { new: true }
    )

    return res
      .status(200)
      .json(new ApiResponses(200, {}, "Otp sent Through Email to user"))

  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while sending otp to user");
  }

})

const otpVerification = asyncHandler(async (req, res) => {

  const { otp } = req.body

  if (!otp) {
    throw new ApiErrors(400, "Otp is requried for email verification  to change password ");
  }

  const clearOtp = async () => {
    await User.findByIdAndUpdate(req.user?._id,
      {
        $set: {
          otp: "",
          expiryIn: ""
        }
      }, { new: true }
    )
  }
  try {
    const user = await User.findById(req.user?._id)

    if (Date.now() > parseInt(user.expiryIn)) {
      await clearOtp();
      throw new ApiErrors(400, "Error: Otp expired or Invalid. Try again");
    }

    const securedOtp = await bcrypt.compare(otp.toString(), user.otp)

    if (!securedOtp) {
      throw new ApiErrors(401, "Error: Otp expired or Invalid. Try again");
    }

    await clearOtp()

    return res
      .status(200)
      .json(new ApiResponses(200, {}, "OTP verified successfully"));
  } catch (error) {
    clearOtp()
    throw new ApiErrors(500, error.message || "Internal server error while verying otp")
  }

})

const otpVerificationForgotPassword = asyncHandler(async (req, res) => {

  const { username, email, otp } = req.body

  if (!(username || email)) {
    throw new ApiErrors(400, "username or email is required")
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!user) {
    throw new ApiErrors(404, "User does not exists");
  }

  const clearOtp = async () => {
    await User.findByIdAndUpdate(user?._id,
      {
        $set: {
          otp: "",
          expiryIn: null
        }
      }, { new: true }
    )
  }
  try {

    if (Date.now() > parseInt(user.expiryIn)) {
      await clearOtp();
      throw new ApiErrors(400, "Error: Otp expired or Invalid. Try again");
    }

    const securedOtp = await bcrypt.compare(otp.toString(), user.otp)

    if (!securedOtp) {
      throw new ApiErrors(401, "Error: Otp expired or Invalid. Try again");
    }

    const resetToken = await user.generateResetToken(user._id)

    await clearOtp()

    return res
      .status(200)
      .json(new ApiResponses(200, { resetToken }, "OTP verified successfully"));
  } catch (error) {
    clearOtp()
    throw new ApiErrors(500, error.message || "Internal server error while verying otp")
  }

})



const getUserChannel = asyncHandler(async (req, res) => {

  const { username } = req.params

  if (!username) {
    throw new ApiErrors(400, "username is missing")
  }

try {
    const channel = await User.aggregate([
      {
        $match: {
          username: username.toLowerCase()
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "channel",
          as: "subscribers"
        }
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "subscriber",
          as: "subscribedTo"
        }
      },
      { 
        $addFields: {
          subscribersCount: {
            $size: "$subscribers"
          },
          channelsubscribedToCount: {
            $size: "$subscribedTo"
          },
          isSubscribedTo: {
            $cond: {
              if: { $in: [req.user?._id, "$subscribers.subscriber"] },
              then: true,
              else: false
            }
          }
        }
      },
      {
        $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsubscribedToCount: 1,
          isSubscribedTo: 1,
          avatar: 1,
          coverImage: 1,
          email: 1,
          createdAt: 1
        }
      }
    ])
  
    console.log(channel)
    if (!channel?.length) {
      throw new ApiErrors(404, "Channel does not exists");
    }
  
    return res
      .status(200)
      .json(
        new ApiResponses(200, channel[0] , "User channel fetched successfully")
      )
  
} catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while fetching user's channel")
}

})


const getUserWatchHistory = asyncHandler(async (req, res) => {
try {
  
    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.user?._id)
        }
      },
        {
        $lookup: {
          from: "videos",
          localField: "_id",
          foreignField: "watchHistory",
          as: "watchHistory",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      fullName: 1,
                      avatar: 1
                    }
                  }
                ]
              }
            },
              {
              $addFields: {
                owner: {
                  $first: "$owner"
                }
              }
            }
          ]
        }
      }
    ]) 
  
    return res
    .status(200)
    .json( new ApiResponses(200, user[0].watchHistory, "User watch History fetched successfully"))
} catch (error) {
  throw new ApiErrors(500, error.message || "Internal Server Error while fetching user watch history")
}
})


const fetchUserVideos = asyncHandler( async (req, res) =>{

   const { username } = req.params

     const { page = 1, limit = 10, query, sortBy = "views", sortType = "desc" } = req.query

   if(!username){
     throw new ApiErrors(400, "username is missing")
   }

  try {
     const user = await User.findOne({username: username}).select(
      "-password -refreshToken -otp"
     )
  
     if (!user) {
      throw new ApiErrors(404, "User does not exists")
     }

    const limitNumber = parseInt(limit, 10)
    const pageNumber = parseInt(page, 10)

    const filter = {}

    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { tag: { $regex: query, $options: "i" } }
        ]
    }

    const sort = {}

    if (sortBy) {
        sort[sortBy] = sortType === "desc" ? -1 : 1;
    }
  
     const userVideos = await Video.find({owner: new mongoose.Types.ObjectId(user?._id)})
     .sort(sort)
     .skip((pageNumber - 1) * 10)
     .limit(limitNumber)
      
     if (userVideos.length === 0) {
        userVideos =  "No vidoes found for this user!"
     }
  
     return res
     .status(200)
     .json( new ApiResponses(200, {userVideos, user} , "user's videos fetched successfully"))
  } catch (error) {
    throw new ApiErrors(500, "Internal Server Error while fetcing user videos")
  }
    
})


const forgotPassword = asyncHandler(async (req, res) => {

  const { username, email, newPassword } = req.body

  if (!(username || email)) {
    throw new ApiErrors(400, "username or email is required")
  }

    if (!newPassword) {
    throw new ApiErrors(400, "password field is required");
  }

  const users = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (!users) {
    throw new ApiErrors(404, "User does not exists");
  }
  
  try {
    const currUser = await User.findById(users?._id)
    
    if (!currUser) {
    throw new ApiErrors(404, "User does not exists")  
    }

    currUser.password = newPassword;
    await currUser.save({ validateBeforeSave: false })

    return res
      .status(200)
      .json(new ApiResponses(200, {}, "Password was changed Successfully"))
  } catch (error) {
    throw new ApiErrors(500, error.message || "Internal Server Error while changing password");
  }
})



export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessandRefreshTokens,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  upadteAvatar,
  upadtecoverImage,
  deleteAccount,
  sendOtp,
  otpVerification,
  getUserChannel,
  getUserWatchHistory,
  fetchUserVideos,
  otpVerificationForgotPassword,
  sendOtpforgotpassword,
  forgotPassword
}