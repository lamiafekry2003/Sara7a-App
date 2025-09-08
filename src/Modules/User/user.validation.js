import Joi from "joi"
import { generalFiled } from "../../Middlewares/validation.middlewares.js"
import { logoutEnum } from "../../Utils/token/token.utils.js"
import { fileValidation } from "../../Utils/multer/local.multer.js"

export const shareProfileValidation={
   params:Joi.object({
    userId:generalFiled.id.required()
   })
}
export const updateProfileValidation={
   body:Joi.object({
    firstName:generalFiled.firstName,
    lastName:generalFiled.lastName,
    phoneNumber:generalFiled.phoneNumber,
    gender:generalFiled.gender,
   })
}
export const freezeAccountValidation={
   params:Joi.object({
    userId:generalFiled.id
   })
}
export const restoreAccountAdminValidation={
   params:Joi.object({
    userId:generalFiled.id.required()
   })
}
export const hardDeleteValidation={
   params:Joi.object({
    userId:generalFiled.id
   })
}
export const updatePasswordValidation={
   body:Joi.object({
   flag: Joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayLogedIn),
    oldPassword:generalFiled.password.required(),
    password:generalFiled.password.not(Joi.ref('oldPassword')).required(),
    repeat_password:generalFiled.repeat_password
   })
}
export const forgetPasswordValidation={
   body:Joi.object({
    email:generalFiled.email.required(),
   })
}

export const resetPasswordValidation={
   body:Joi.object({
    email:generalFiled.email.required(),
    otp:generalFiled.otp.required(),
    password:generalFiled.password.required(),
    repeat_password:generalFiled.repeat_password,
   })
}

export const updateProfileImageValidation={
   file:Joi.object({
      fieldname:generalFiled.file.fieldname.valid('profileImage').required(),
      originalname:generalFiled.file.originalname.required(),
      encoding:generalFiled.file.encoding.required(),
      mimetype:generalFiled.file.mimetype.valid(...fileValidation.image).required(),
      size:generalFiled.file.size.max(5 * 1024 * 1024).required(), //5MB
      path:generalFiled.file.path.required(),
      filename:generalFiled.file.filename.required(),
      destination:generalFiled.file.destination.required(),
      finalPath:generalFiled.file.finalPath.required(),
    
   }).required()
}

export const updateCoverImageValidation={
   files:Joi.array().items(
      Joi.object({
      fieldname:generalFiled.file.fieldname.valid('coverImage').required(),
      originalname:generalFiled.file.originalname.required(),
      encoding:generalFiled.file.encoding.required(),
      mimetype:generalFiled.file.mimetype.valid(...fileValidation.image).required(),
      size:generalFiled.file.size.max(5 * 1024 * 1024).required(),
      path:generalFiled.file.path.required(),
      filename:generalFiled.file.filename.required(),
      destination:generalFiled.file.destination.required(),
      finalPath:generalFiled.file.finalPath.required(),
    
   }).required()
   ).required()
}



