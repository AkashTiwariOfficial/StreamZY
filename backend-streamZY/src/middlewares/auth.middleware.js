import { User } from "../models/user.models";
import { ApiErrors } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler( async (req, _, next) => {
     
  try {
     const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
  
     if(!token){
      throw new ApiErrors(401, "Unauthorized request");
     }
  
     const verfiedToken = jwt.verify(token, process.env.ACCESS_JWT_TOKEN_SECRET);
  
     const user = await User.findById(verfiedToken._id).select(
      "-password -refreshToken"
     )
  
     if(!user){
      throw new Errors(401,"Invalid Access Token")
     }
  
     req.user = user
     next()
  } catch (error) {
     throw new ApiErrors(400, error?.message || "Invalid Access Token");
  }
})