import Joi from "joi";
import { Types } from "mongoose";

export const generalFiled={
    firstName:Joi.string().min(3).max(20).messages({
        'string.min':'First name must be at least 3 character ',
        'string.max':'First name must be at most 20 character ',
        'any.required':'First name must be required ',
      }),
      lastName:Joi.string().min(3).max(20).messages({
        'string.min':'Last name must be at least 3 character ',
        'string.max':'Last name must be at most 20 character ',
        'any.required':'Last name must be required ',
      }),
      email:Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net' ,'org' ,'io','gov'] } }),
      password:Joi.string(),
      repeat_password: Joi.ref('password'),
      gender:Joi.string().valid('male','female').default('male'),
      role:Joi.string().valid('USER','ADMIN').default('USER'),
      phoneNumber:Joi.string(),
      id:Joi.string().custom((value,helper)=>{
        return Types.ObjectId.isValid(value) || helper.message('invalid object id format')
      }),
      otp:Joi.string().pattern(/^\d{6}/),
      refreshToken: Joi.string()
    .pattern(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/) 
    .messages({
      "string.pattern.base": "Invalid refresh token format",
    }),
    content:Joi.string().min(2).max(20000),
    file:{
      fieldname:Joi.string(),
      originalname:Joi.string(),
      encoding:Joi.string(),
      mimetype:Joi.string(),
      size:Joi.number().positive(),
      path:Joi.string(),
      filename:Joi.string(),
      destination:Joi.string(),
      finalPath:Joi.string(),
    }
  
}
export const validation = (schema) => {
  return (req, res, next) => {
    const validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (validationResult.error) {
        validationError.push({ key, details: validationResult.error.details });
      }

      if (validationError.length) {
        return res
          .status(400)
          .json({ message: "validation error", details: validationError });
      }
    }
    return next();
  };
};
