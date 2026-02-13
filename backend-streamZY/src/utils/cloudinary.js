import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  timeout: 900000,
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return console.log("localFilePath not found !!");

    // uploading file on cloudinary:- 
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    //file has been uploaded:-
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
    }
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    console.log("Error while uploading on clodinary file", error.message)
  }
}


const uploadVideoOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return console.log("localFilePath not found !!");

    if (!fs.existsSync(localFilePath)) {
      console.log("File path not found");
      return null;
    }

    // Wrap upload_large in a Promise
    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        localFilePath,
        { resource_type: "video", chunk_size: 7000000 },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
    });

   await fs.promises.unlink(localFilePath);

    return response;

  } catch (error) {
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath);
      }
    } catch (unlinkError) {
      console.log("Failed to delete local file:", unlinkError.message);
    }

    console.log("Cloudinary Upload Error:", error);
    return null;
  }
};



const deleteFromCloudinary = async (public_id, type ) => {

  try {
    if (!public_id) {
      return console.log("public_id for specified file do not exits")
    }

    await cloudinary.uploader.destroy(public_id, { resource_type: type })
  } catch (error) {
    console.log("Error while deleting from cloudinary: ", error.message);
  }
}


export { uploadOnCloudinary, deleteFromCloudinary, uploadVideoOnCloudinary }