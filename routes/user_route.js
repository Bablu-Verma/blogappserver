import express from 'express'
import { UserDetails, EditUserDetail, ChangeUserPassword, DeleteAccountRequest, DeleteAccountVerifyOTP, EditUserProfile, getOtherUserDetails, UserList, CheckUserDetailByAdmin, DeleteUserByAdmin, SearchUserByAdmin } from '../controllers/user_controller.js'
import { checkLoginMiddleware } from '../middleware/checkUser.js'
import { uploadUserImage } from '../config/uploadUserImage.js'
import { checkAdminMiddleware } from '../middleware/CheckAdmin.js'



// rout object 
const user_route = express.Router()

user_route.get('/user-details', checkLoginMiddleware, UserDetails)
user_route.post('/get-other-user-details', checkLoginMiddleware, getOtherUserDetails)
user_route.post('/edit-user-detail', checkLoginMiddleware, uploadUserImage.single("profile"), EditUserDetail)
user_route.post('/edit-user-profile', checkLoginMiddleware, uploadUserImage.single("profile"), EditUserProfile)
user_route.post('/change-user-password', checkLoginMiddleware, ChangeUserPassword)
user_route.post('/delete-account-request', checkLoginMiddleware, DeleteAccountRequest)
user_route.post('/delete-account-otp-verify', checkLoginMiddleware, DeleteAccountVerifyOTP)

// admin route
user_route.get('/user-list', checkLoginMiddleware,checkAdminMiddleware, UserList)
user_route.post('/check-user-detail-by-admin', checkLoginMiddleware,checkAdminMiddleware, CheckUserDetailByAdmin)
user_route.post('/delete-user-by-admin', checkLoginMiddleware,checkAdminMiddleware, DeleteUserByAdmin)
user_route.post('/search-user-by-admin', checkLoginMiddleware,checkAdminMiddleware, SearchUserByAdmin)



export default user_route