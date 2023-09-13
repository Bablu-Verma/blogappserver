import express from 'express'

import { checkLoginMiddleware } from '../middleware/checkUser.js'
import { AddCategory, CategoryList, DeleteCategory } from '../controllers/category_controller.js';
import { checkAdminMiddleware } from '../middleware/CheckAdmin.js';

// rout object 
const category_route =  express.Router()

category_route.post('/add',checkLoginMiddleware,checkAdminMiddleware, AddCategory);
category_route.get('/list', CategoryList);
category_route.post('/delete',checkLoginMiddleware,checkAdminMiddleware, DeleteCategory);

export default category_route