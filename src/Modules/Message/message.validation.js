import Joi from "joi";
import { generalFiled } from "../../Middlewares/validation.middlewares.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";

export const sendMessageValidation = {
  params: Joi.object({
    receiver_id: generalFiled.id.required(),
  }).required(),

  body: Joi.object({
    content: generalFiled.content,
  }),

  files: Joi.array()
    .items(
      Joi.object({
        fieldname: generalFiled.file.fieldname.valid("attachment").required(),
        originalname: generalFiled.file.originalname.required(),
        encoding: generalFiled.file.encoding.required(),
        mimetype: generalFiled.file.mimetype
          .valid(...fileValidation.image)
          .required(),
        size: generalFiled.file.size.max(5 * 1024 * 1024).required(),
        path: generalFiled.file.path.required(),
        filename: generalFiled.file.filename.required(),
        destination: generalFiled.file.destination.required(),
      })
    )
    .min(0)
    .max(3),
};
export const getMessageValidation = {
  params: Joi.object({
    userId: generalFiled.id.required(),
  }).required(),

};

