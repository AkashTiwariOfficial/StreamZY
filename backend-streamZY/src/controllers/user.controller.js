import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponses } from "../utils/ApiResponses.js"
import jwt from "jsonwebtoken"


const generateAccessTokenandRefreshToken = async (userId) => {
        
  try {

 const user = await User.findById(userId);
 const accessToken = user.generateAccessToken();
 const refreshToken = user.generateRefreshToken();

 user.refreshToken = refreshToken
 user.save({ validateBeforeSave: false })

 return { accessToken, refreshToken }
}catch (error) {
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
    username: username.toLowerCase()
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!userCreated) {
    throw new ApiErrors(500, "Internal Server Error! while registering a new user. Please Try Again");
  }

  return res.status(201).json(
    new ApiResponses(200, userCreated, "User registered successfully")
  )

})


const loginUser = asyncHandler( async (req, res) => {
      // req.body -> data
      // login through username or email
      // find user
      // check password
      // access and resfresh Tokens
      // send cookies
   
    const { username, email, password } = req.body

    if(!(username || email)){
      throw new ApiErrors(400, "username or email is required")
    }

   const user = await User.findOne({
      $or: [{ username }, { email }]
    })

    if(!user){
      throw new ApiErrors(404, "User does not exists");
    }

   const passwordCorrect = await user.isPasswordCorrect(password);

   if(!passwordCorrect){
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

   return  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
    new ApiResponses(200, 
      {
      data: loggedUser, accessToken, refreshToken
    }
    ,"User logged In Successfully")
   )

})


const logoutUser = asyncHandler( async (req, res) => {

        await User.findByIdAndUpdate(req.user._id,
          {
            $set: {
              refreshToken: undefined
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
  .json( new ApiResponses(200, {}, "User logged out successfully"))

})


const refreshAccessandRefreshTokens = asyncHandler( async (req, res) => {
     
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiErrors(401, "Unauthorized Access! Access Denied")
  }

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
            ApiErrors(200, {
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

export { 
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessandRefreshTokens
 }