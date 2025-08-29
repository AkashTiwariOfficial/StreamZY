import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: CLOUD_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
      try {
        if(!localFilePath) return console.log("localFilePath not found !!") ;
      // uploading file on cloudinary:- 
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      });
      //file has been uploaded:-
      console.log("File has been uploaded on cloudinary ",response.url);
      return response
      } catch (error) {
         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
          return null
        }
}


export { uploadOnCloudinary }