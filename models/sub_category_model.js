import mongoose from "mongoose";
import moment from "moment/moment.js";

const SubCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    },
    createSubCategory: {
        type: String,
        default: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
   
}, { timestamps: true });

const SubCategoryModel = mongoose.model('SubCategory', SubCategorySchema);

export default SubCategoryModel