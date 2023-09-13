import mongoose from "mongoose";
import moment from "moment/moment.js";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subTitle: {
        type: String,
    },
    image: {
        type: String,
    },
    text:{
        type: String,
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    slug:{
        type: String,
        required: true,
    },
    createUser: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
   
}, { timestamps: true });

const blogModel = mongoose.model('Blog', blogSchema);

export default blogModel