import dotenv from "dotenv"
import jwt from 'jsonwebtoken'
import UserModel from "../models/user_model.js"

dotenv.config()

const secretKey = process.env.secretKey

export const checkLoginMiddleware = async (req, resp, next)=>{
    const authorization = req.headers['authorization'];
   
    if (!authorization) {
        return resp.status(401).send({ 
            message: 'Some Error Login Again', 
            status: 0, 
        });
      }
   try {
    const decodedToken = jwt.verify(authorization, secretKey);

    const server_user = await UserModel.findOne({email:decodedToken.email})
    //  console.log(server_user)
    if(!server_user){
       return resp.status(500).send({
            status: 0,
            message: 'User Not Valid, Login Again',
            error
        })
     }
     next()
   } catch (error) {
    resp.status(500).send({
        status: 0,
        message: 'Server Error',
        error
    })
   }
}