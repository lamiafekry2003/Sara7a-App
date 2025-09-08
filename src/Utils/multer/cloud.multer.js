import multer from "multer";
import { cloudinaryConfig } from "./cloudinary.js";

export const cloudFileUpload = ({validation=[]})=>{

    const storage = multer.diskStorage({})
   
    const fileFilter = (req,file,cb) =>{
        if(validation.includes(file.mimetype)){
        cb(null,true)
        }else{
            cb(new Error('invalid file format',{cause:400}),false)
        }
    }
    return multer({
        storage,
        fileFilter,
    })
}
// uploadImages
export const uploadImages = async({filePath,type,userId,fileType})=>{
   return await cloudinaryConfig().uploader.upload(filePath,
          {
            folder:`Sara7a-App/${fileType}/${type}/${userId}`,
          }
        );
}
// destroyImage
export const destroyImages = async({filePath})=>{
   return await cloudinaryConfig().uploader.destroy(filePath);
}