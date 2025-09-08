import { Router } from "express"
import * as authServices from './auth.service.js'
import { authentication, tokenTypesEnum } from "../../Middlewares/authentication.middleware.js"
import { validation } from "../../Middlewares/validation.middlewares.js"
import { confirmEmail, loginValidation, logoutValidation, signUpValidation, socialLogin } from "./auth.validation.js"

const router = Router()
router.post('/signUp',validation(signUpValidation),authServices.signUp)
router.post('/login',validation(loginValidation),authServices.login)
router.post('/loginWithGmail',validation(socialLogin),authServices.loginWithGmail)
router.post('/logout',validation(logoutValidation),authentication({tokenType:tokenTypesEnum.access}),authServices.logout)
router.get('/refresh-token',authentication({tokenType:tokenTypesEnum.refresh}),authServices.refreshToken)
router.patch('/confirm-email',validation(confirmEmail),authServices.confirmEmail)
export default router