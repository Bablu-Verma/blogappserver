import mongoose from "mongoose";
import moment from "moment/moment.js";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    profile: {
        type: String,
    },
    bio:{
        type: String,
        default:"i'm Using Readblog.com"
    },
    password:{
        type: String,
        required: true,
    },
    userType:{
        type: Number,
        default:0,
        required: true,
    },
    otp:{
        type: String,
        default:null
    },
    createUser: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
   
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

export default UserModel