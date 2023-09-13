import mongoose from "mongoose";
import moment from "moment/moment.js";

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    blogId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createCategory: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
   
}, { timestamps: true });

const CommentModel = mongoose.model('Comment', CommentSchema);

export default CommentModel