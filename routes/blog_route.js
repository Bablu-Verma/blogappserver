import express from 'express'

import { uploadUserImage } from '../config/uploadUserImage.js'
import { AddBlog, AllBlog, BlogDetails, BlogSearch, DeleteBlog, DeleteBlogByAdmin, EditBlog, FilterBlog, ListUserBlog } from '../controllers/blog_controller.js'
import { checkLoginMiddleware } from '../middleware/checkUser.js'

// rout object 
const blog_route =  express.Router()

blog_route.post('/add', checkLoginMiddleware, uploadUserImage.single("image"),AddBlog)
blog_route.post('/user-blog', checkLoginMiddleware, ListUserBlog)
blog_route.post('/all-blog', AllBlog)
blog_route.get('/detail/:slug', BlogDetails);
blog_route.post('/edit-blog',checkLoginMiddleware, uploadUserImage.single("image"), EditBlog);
blog_route.post('/delete-blog',checkLoginMiddleware, DeleteBlog);

blog_route.post('/search-blog', BlogSearch);
blog_route.post('/filter', FilterBlog);

// admin 
blog_route.post('/delete-blog-by-admin', DeleteBlogByAdmin);


export default blog_route