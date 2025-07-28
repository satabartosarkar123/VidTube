import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });


const uploadOnCloudinary = async (filePath) => {
    try{
        if(!filePath) {
            throw new Error("File path is required for uploading to Cloudinary");
        }
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type:'auto'
        });
        console.log("file uploaded on cloudinary", result.url);
        fs.unlinkSync(filePath); // delete the file from local storage after uploading
        return {
            url: result.url,
            public_id: result.public_id
        };
    }
    catch(error){//unlink the localFilePath
        fs.unlinkSync(filePath); // delete the file from local storage
        return null; // rethrow the error to be handled by the caller
    }
}


export {uploadOnCloudinary};