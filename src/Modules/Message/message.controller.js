import { Router } from "express";
import { cloudFileUpload } from "../../Utils/multer/cloud.multer.js";
import { fileValidation } from "../../Utils/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middlewares.js";
import { getMessageValidation, sendMessageValidation } from "./message.validation.js";
import * as messageServices from './message.service.js'
import { authentication, tokenTypesEnum } from "../../Middlewares/authentication.middleware.js";
const router = Router()

router.post('/:receiver_id/send_message',
    cloudFileUpload({validation:[...fileValidation.image]}).array('attachment',5),
    validation(sendMessageValidation),
    messageServices.sendMessage
)
// if user authenticated
router.post('/:receiver_id/sender',
    authentication({tokenType:tokenTypesEnum.access}),
    cloudFileUpload({validation:[...fileValidation.image]}).array('attachment',5),
    validation(sendMessageValidation),
    messageServices.sendMessage
)
router.get('/:userId/get-message',validation(getMessageValidation),messageServices.getMessage)

export default router