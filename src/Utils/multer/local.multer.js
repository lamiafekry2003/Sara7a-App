import multer from "multer";
import path from "node:path"
import fs from 'node:fs'

export const fileValidation = {
    image: ['image/png', 'image/jpg', 'image/jpeg'],
    video: ['video/mp4','video/mkv','video/avi'],
    audio: ['audio/mpeg','audio/wav','audio/ogg'],
    document: 
    ['application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
}
export const localFileUpload = ({customPath = 'general' ,validation=[]})=>{
    let basePath = `uploads/${customPath}`

    const storage = multer.diskStorage({
        destination:(req,file,cb) =>{
            if(req.user?._id) basePath += `/${req.user._id}`
            const fullPath = path.resolve(`./src/${basePath}`)
            // to check if the path exist or not
            if(!fs.existsSync(fullPath))
            fs.mkdirSync(fullPath,{ recursive:true})

            cb(null,path.resolve(fullPath))
        },
        filename:(req,file,cb) =>{
            const uniqueFileName =Date.now() +'__'+ Math.random() +'__'+ file.originalname;
            file.finalPath = `${basePath}/${uniqueFileName}`
            cb(null,uniqueFileName)
        }
    })
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