import { Router } from "express";
import * as userServices from './user.service.js'
import { authentication, authorization, tokenTypesEnum } from "../../Middlewares/authentication.middleware.js";
import { endPoints } from "./user.authorization.js";
import { validation } from "../../Middlewares/validation.middlewares.js";
import { forgetPasswordValidation, freezeAccountValidation, hardDeleteValidation, resetPasswordValidation, restoreAccountAdminValidation, shareProfileValidation, updateCoverImageValidation, updatePasswordValidation, updateProfileImageValidation, updateProfileValidation } from "./user.validation.js";
import { fileValidation, localFileUpload } from "../../Utils/multer/local.multer.js";
import { cloudFileUpload } from "../../Utils/multer/cloud.multer.js";

const router = Router()
router.get('/getSingleUser',authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles: endPoints.getProfile }),userServices.getSingleUser)
router.get('/share-profile/:userId',validation(shareProfileValidation),userServices.sahreProfile)
router.patch('/update-user',validation(updateProfileValidation),authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.updateProfile}),userServices.updateProfile)
router.delete('{/:userId}/freeze-account',validation(freezeAccountValidation),authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.freezeAccount}),userServices.freezeAccount)
router.patch('{/:userId}/restore-account-Admin',validation(restoreAccountAdminValidation),authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.restoreAccountAdmin}),userServices.freezeAccountAdmin)
router.patch('/restore-account-user',authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.restoreAccountUser}),userServices.restoreAccountUser)
router.delete('/:userId/hard-deleted',validation(hardDeleteValidation),authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.hardDelete}),userServices.hardDelete)
router.patch('/update-password',validation(updatePasswordValidation),authentication({tokenType:tokenTypesEnum.access}),authorization({accessRoles:endPoints.updatePassword}),userServices.updatePassword)
router.patch('/forget-password',validation(forgetPasswordValidation),userServices.forgetPassword) //set email to send otp
router.patch('/reset-password',validation(resetPasswordValidation),userServices.resetPassword) //send otp and new password
router.patch('/update-profile-image',authentication({tokenType:tokenTypesEnum.access}),
// localFileUpload({customPath:'User',validation:[...fileValidation.image]}).
// single('profileImage'),
cloudFileUpload({validation:[...fileValidation.image]}).single('profileImage'),
// validation(updateProfileImageValidation),
userServices.updateProfileImage) 

router.patch('/cover-image',authentication({tokenType:tokenTypesEnum.access}),
// localFileUpload({validation:[...fileValidation.image]}).array('coverImage',5),
cloudFileUpload({validation:[...fileValidation.image]}).array('coverImage',5),
// validation(updateCoverImageValidation),
userServices.coverImage) 

export default router