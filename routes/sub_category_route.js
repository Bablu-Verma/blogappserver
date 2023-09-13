import express from 'express'

import { checkLoginMiddleware } from '../middleware/checkUser.js'
import { checkAdminMiddleware } from '../middleware/CheckAdmin.js';
import { AddSubCategory, DeleteSubCategory, SubCategoryList } from '../controllers/sub_category_contorller.js';

// rout object 
const subCategory_route =  express.Router()

subCategory_route.post('/add',checkLoginMiddleware,checkAdminMiddleware, AddSubCategory);
subCategory_route.post('/list', SubCategoryList);
subCategory_route.post('/delete',checkLoginMiddleware,checkAdminMiddleware, DeleteSubCategory);

export default subCategory_route