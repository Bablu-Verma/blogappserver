import UserModel from "../models/user_model.js";
import bcrypt, { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import { sendOTPMiddleware } from "../middleware/verifyUser.js";
import {generateOTP} from '../config/small_function.js'

dotenv.config()
const secretKey = process.env.secretKey

export const Register = async (req, resp) => {
    const { name, email, password, bio } = req.body

    const Profile = req.file?.filename || null

    try {
        //   validat input data    
        if (!name) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Your Name',
            })
        }
        if (name.length <= 2) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Name should be minimum 3 characters',
            })
        }

        if (!email) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Your Email',
            })
        }
        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter valid Email',
            })
        }
        if (!password) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Your Password',
            })
        }
        if (password.length <= 5) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Strong Password, minimum 6 characters',
            })
        }
      const BIO = bio.length > 0 ? bio : "i'm Using Readblog.com"
        // check user 

        const db_user = await UserModel.find({ email: email })
        // console.log(db_user)
        if (!(db_user.length == 0)) {
            return resp.status(200).send({
                code: 1,
                status: 0,
                message: 'You are email already register In Our Server, Login Now ',
                email: email
            })
        }
        //    has password 
        const salt = 10
        const hashedPassword = await bcrypt.hash(password, salt);
        //   save user in db 
        const user = UserModel({ name, email, profile: Profile, bio:BIO,  password: hashedPassword });
        const saveUser = await user.save()
        resp.status(201).send({
            status: 1,
            message: 'User Register Successfully, Login Now',
            user: saveUser
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const Login = async (req, resp) => {
    const { email, password } = req.body
    try {
        //   validat input data 
        if (!email) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Your Email',
            })
        }
        if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter valid Email',
            })
        }
        if (!password) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Your Password',
            })
        }
        if (password.length <= 5) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'Enter Strong Password, minimum 6 characters',
            })
        }

        // check user 
        const db_user = await UserModel.findOne({ email: email })

        if (!db_user) {
            return resp.status(401).send({
                code: 0,
                status: 0,
                message: 'User Not Register, register First',
            })
        }

        //  compare password 
        const server_password = db_user.password
        bcrypt.compare(password, server_password, (err, result) => {
            if (err) {
                return resp.status(500).send({
                    status: 0,
                    message: 'Server Error, try again',
                    err
                })
            }
            if (result) {
                // create jwt token 
                const user_data = {
                    email: db_user.email,
                    id: db_user._id
                }
                const token = jwt.sign(user_data, secretKey, { expiresIn: '7d' });
                // console.log(result)
                resp.status(200).send({
                    status: 1,
                    message: 'User Login Successfully',
                    user: {
                        email: db_user.email,
                        name: db_user.name,
                        profile: db_user.profile,
                    },
                    token
                })
            } else {
                resp.status(422).send({
                    status: 0,
                    code: 0,
                    message: 'Email & password Not Match try Again',
                })
            }
        });
    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const ForgotPasswordRequest = async (req, resp) => {
    // console.log(req.body)
    const { email } = req.body

    if (!email) {
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'Enter Your Email',
        })
    }
    if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'Enter valid Email',
        })
    }

    try {

        const find_user = await UserModel.findOne({ email: email })
        if (!find_user) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'User Not Register, register First',
            })
        }

        //  create otp 
        const user_OTP = generateOTP();

        await UserModel.findByIdAndUpdate({ _id: find_user._id }, { otp: user_OTP }, { new: true })
        // send  email 
        let text_data = 'Your Forgot Password  OTP is : '
        
        sendOTPMiddleware(find_user.email, user_OTP, text_data)

        //   genreate now time 
        const now_date = new Date();
        const now_time = now_date.getTime();
         
        // create jwt token 
        const user_data = {
            email: find_user.email,
            id: find_user._id,
            time: now_time
        }

        const token = jwt.sign(user_data, secretKey, { expiresIn: '1d' });

        return resp.status(200).send({
            code: 1,
            status: 1,
            message: 'change password accepted, Verify OTP ',
            token
        })
    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const ResendForgotPasswordOTP = async (req, resp) => {
    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);
    //  console.log(decodedToken)
    try {

        const find_user = await UserModel.findOne({ email: decodedToken.email })

        if (!find_user) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'User Not Register, register First',
            })
        }

        // console.log(find_user)

        //  create otp 
        const user_OTP = generateOTP();
        // console.log('Generated OTP:', user_OTP);

        await UserModel.findByIdAndUpdate({ _id: find_user._id }, { otp: user_OTP }, { new: true })
         
        // send  email 
        let text_data = 'Your Forgot Password Resnd OTP is : '

        sendOTPMiddleware(find_user.email, user_OTP, text_data)

        //   genreate now time 
        const now_date = new Date();
        const now_time = now_date.getTime();
     
        // create jwt token 
        const user_data = {
            email: find_user.email,
            id: find_user._id,
            time: now_time
        }

        const token = jwt.sign(user_data, secretKey, { expiresIn: '1d' });

        return resp.status(200).send({
            code: 1,
            status: 1,
            developer_msg:'resend OTP Call',
            message: 'change password accepted, Verify OTP',
            token
        })
    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const EnterForgotPasswordOTP = async (req, resp) => {

    const { otp } = req.body
    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);

    if (!otp) {
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'Enetr OTP',
        })
    }
    if (!otp.length == 4) {
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'OTP should Be 4 Digit',
        })
    }

    console.log(decodedToken)

    try {

        const server_user = await UserModel.findOne({ _id: decodedToken.id })
        // console.log(server_user)

        if (!(otp == server_user.otp)) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'OTP not Match, try anain',
            })
        }


        //   genreate now time 
        const now_date = new Date();
        const now_time = now_date.getTime();

        if (now_time - decodedToken.time > 1800000) {
            return resp.status(422).send({
                code: 0,
                status: 0,
                message: 'OTP Valid Only 30 Min, resend OTP',
            })
        }

        //    create  jwt token 
        const user_data = {
            email: server_user.email,
            id: server_user._id,
        }

        const token = jwt.sign(user_data, secretKey, { expiresIn: '1d' });

        resp.status(200).send({
            status: 1,
            message: 'Verifyed, Change Your Password',
            token
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const EnterForgotPassword = async (req, resp) => {
    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);

    //  console.log(decodedToken)
    const { password } = req.body
    if (!password) {
        return resp.status(401).send({
            code: 0,
            status: 0,
            message: 'Enter Your Password',
        })
    }
    if (password.length <= 5) {
        return resp.status(401).send({
            code: 0,
            status: 0,
            message: 'Enter Strong Password, minimum 6 characters',
        })
    }

    try {
        // find user 
        const server_user = await UserModel.findOne({ email: decodedToken.email })

        // has password 
        const salt = 10
        const hashedPassword = await bcrypt.hash(password, salt);

        // save password 
        await UserModel.findByIdAndUpdate({ _id: server_user._id }, { password: hashedPassword }, { new: true })

        resp.status(200).send({
            status: 1,
            message: 'Change Your Password Successfull, Login To New Password',
            user: {
                name: server_user.name,
                email: server_user.email,
                username: server_user.username
            }
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}



