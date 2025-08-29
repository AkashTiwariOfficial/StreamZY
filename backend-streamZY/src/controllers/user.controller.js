import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors }  from "../utils/ApiErrors.js";
import { User  } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponses from "../utils/ApiResponses.js"

const registerUser = asyncHandler( async (req, res)=>{
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

    if(
      [fullName, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiErrors(400, "All fields are required.")
    }
    if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)){
      throw new ApiErrors(400, "Invalid email format")
    }

   const userExists = await User.findOne({
      $or: [{ username }, { email }]
})

if(userExists){
  throw new ApiErrors(409, "User with email or username already Exists");
}
 
  const avatarFilePath = req.files?.avatar[0]?.path;
  const coverImageFilePath = req.files?.coverImage[0]?.path;

  if (!avatarFilePath) {
    throw new ApiErrors(400, "Avatar file is required");
  }

 const avatar = await uploadOnCloudinary(avatarFilePath);
 const coverImage = await uploadOnCloudinary(coverImageFilePath);
  
 if(!avatar){
throw new ApiErrors(400, "Avatar file is required")
 }

const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage:  coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
});

const userCreated = User.findById(user._id).select(
  "-password -refreshToken"
)

if (!userCreated) {
  throw new ApiErrors(500, "Internal Server Error! Please Try Again");
}

return res.status(201).json(
    ApiResponses(200, userCreated, "User registered successfully")
)

})


export { registerUser }