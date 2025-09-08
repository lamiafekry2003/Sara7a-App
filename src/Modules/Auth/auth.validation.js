import Joi from "joi";
import { generalFiled } from "../../Middlewares/validation.middlewares.js";
import { logoutEnum } from "../../Utils/token/token.utils.js";
// validate data in backend
export const signUpValidation = {
  body:Joi.object({
  firstName:generalFiled.firstName.required(),
  lastName:generalFiled.lastName.required(),
  email:generalFiled.email.required(),
  password:generalFiled.password.required(),
  repeat_password:generalFiled.repeat_password,
  gender:generalFiled.gender,
  role:generalFiled.role,
  phoneNumber:generalFiled.phoneNumber
}).required()
}

export const loginValidation ={ 
 body: Joi.object({
 email:generalFiled.email.required(),
  password:generalFiled.password.required(),

}).required()
}

// login with google
export const socialLogin = Joi.object({
 idToken:Joi.string().required()

}).required();

// login with confirm email
export const confirmEmail ={
 body: Joi.object({
 email:generalFiled.email.required(),
 otp:generalFiled.otp.required()

}).required()
}

//refreshToken
export const refreshToken = Joi.object({
  token: generalFiled.refreshToken.required()

}).required();

// logout flag
export const logoutValidation =({
  body: Joi.object({
    flag: Joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayLogedIn)
  
  }).required()
})