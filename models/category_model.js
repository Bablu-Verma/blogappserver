import mongoose from "mongoose";
import moment from "moment/moment.js";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    createCategory: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
   
}, { timestamps: true });

const CategoryModel = mongoose.model('Category', CategorySchema);

export default CategoryModel