import express from 'express'
import { EnterForgotPassword, EnterForgotPasswordOTP, ForgotPasswordRequest, Login, Register, ResendForgotPasswordOTP } from '../controllers/auth_controller.js'
import { uploadUserImage } from '../config/uploadUserImage.js'

// rout object 
const auth_route =  express.Router()

auth_route.post('/register',uploadUserImage.single("profile"),Register)
auth_route.post('/login',Login)
auth_route.post('/forgot-password-request',ForgotPasswordRequest)
auth_route.post('/resend-forgot-password-otp', ResendForgotPasswordOTP)
auth_route.post('/enter-forgot-password-otp', EnterForgotPasswordOTP)
auth_route.post('/enter-forgot-password', EnterForgotPassword)

export default auth_route