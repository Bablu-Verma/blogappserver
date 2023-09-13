import express from 'express'

import { checkLoginMiddleware } from '../middleware/checkUser.js'

import { checkAdminMiddleware } from '../middleware/CheckAdmin.js';
import { AddComments, DeleteComment, EditComment, ListCommentsByAuthor, ListCommentsByBlog } from '../controllers/comment_controller.js';

// rout object 
const comment_route =  express.Router()

comment_route.post('/add',checkLoginMiddleware,AddComments );
comment_route.post('/list-comment-by-blog', ListCommentsByBlog);
comment_route.post('/list-comment-by-author',checkLoginMiddleware, ListCommentsByAuthor);
comment_route.post('/edit',checkLoginMiddleware, EditComment);
comment_route.post('/delete',checkLoginMiddleware,DeleteComment );
comment_route.post('/comment-delete-by-admin',checkLoginMiddleware,checkAdminMiddleware, DeleteComment );


export default comment_route