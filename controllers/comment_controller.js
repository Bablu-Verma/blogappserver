import dotenv from "dotenv"
import jwt from 'jsonwebtoken'
import UserModel from "../models/user_model.js"
import CommentModel from "../models/comment_model.js"
import blogModel from "../models/blog_model.js"

dotenv.config()

const secretKey = process.env.secretKey

export const AddComments = async (req, resp) => {

    const { comment, blogId } = req.body
    const authorization = req.headers['authorization'];

    const decodedToken = jwt.verify(authorization, secretKey);

    if (!comment) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Enter Your Comment',
        })
    }

    if (!blogId) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Add Blog Id ',
        })
    }

    try {

        const create_comment = CommentModel({
            comment, blogId, userId: decodedToken.id
        })

        const create_comment_save = await create_comment.save()

        resp.status(201).send({
            status: 1,
            message: 'Add Comment Successfully',
            comment: create_comment_save
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const ListCommentsByBlog = async (req, resp) => {
    const { blogId } = req.body

    const authorization = req.headers['authorization'] || null

    let decodedToken
    if (authorization != null) {
        decodedToken = jwt.verify(authorization, secretKey);
    }

    if (!blogId) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Add Blog Id ',
        })
    }
    try {

        if (authorization == null) {
            const blog_comment = await CommentModel.find({ blogId })
            const promises = blog_comment.map(async (comment) => {
                const user = await UserModel.findById(comment.userId);
                return {
                    ...comment.toObject(),
                    user: {
                        name: user.name,
                        profile: user.profile,
                    },
                };
            });

            const commentsWithUserData = await Promise.all(promises);
            resp.status(200).send({
                status: 1,
                user_login: 0,
                message: 'Blog comment list',
                comment: commentsWithUserData
            })
        } else {
            const blog_comment = await CommentModel.find({ blogId })
            const promises = blog_comment.map(async (comment) => {
                const user = await UserModel.findById(comment.userId);
                return {
                    ...comment.toObject(),
                    user: {
                        name: user.name,
                        profile: user.profile,
                    },
                    author: comment.userId == decodedToken.id ? 1 : 0,
                    admin: user.userType == 1 ? 1 : 0
                };
            });

            const commentsWithUserData = await Promise.all(promises);
            resp.status(200).send({
                status: 1,
                user_login: 1,
                message: 'Blog comment list',
                comment: commentsWithUserData
            })
        }
    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const ListCommentsByAuthor = async (req, resp) => {

    const authorization = req.headers['authorization']
    const decodedToken = jwt.verify(authorization, secretKey);

    try {
        const blog_comment = await CommentModel.find({ userId: decodedToken.id })

        const promises = blog_comment.map(async (blog) => {
            const find_blog = await blogModel.findById(blog.blogId);
            return {
                ...blog.toObject(),
                blog: {
                    title: find_blog.title,
                    id: find_blog._id,
                    image: find_blog.image,
                    slug: find_blog.slug
                }
            };
        })
        const commentsWithBlogData = await Promise.all(promises);
        resp.status(200).send({
            status: 1,
            message: 'Blog comment list',
            comment: commentsWithBlogData,
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const EditComment = async (req, resp) => {
    const { comment, commentId } = req.body

    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);

    if (!comment) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Enter Your Comment',
        })
    }

    if (!commentId) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Add comment Id ',
        })
    }

    try {

        const find_comment = await CommentModel.findById(commentId)

        if (decodedToken.id != find_comment.userId) {
            return resp.status(200).send({
                status: 0,
                message: ' You cant Edit This Comment',
            })
        }

        console.log(find_comment)

        const update_comments = await CommentModel.findByIdAndUpdate({_id:commentId},{comment},{new:true})
        resp.status(200).send({
            status: 1,
            message: ' Comment Update Successfully',
            comment: update_comments
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const DeleteComment = async (req, resp) => {
    const { commentId } = req.body

    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);

    if (!commentId) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Add comment Id ',
        })
    }

    try {

        const find_comment = await CommentModel.findById(commentId)

        if(!find_comment){
            return resp.status(403).send({
                status: 0,
                message: 'comment not exist',
            })
        }

        if (decodedToken.id != find_comment.userId) {
            return resp.status(403).send({
                status: 0,
                message: ' You cant Delete This Comment',
            })
        }

        console.log(find_comment)

        const delete_comments = await CommentModel.findByIdAndRemove(commentId)
        resp.status(200).send({
            status: 1,
            message: ' Comment delete Successfully',
            comment_delete: delete_comments
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}

export const DeleteCommentByAdmin = async (req, resp) => {
    const { commentId } = req.body

    if (!commentId) {
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Add comment Id ',
        })
    }

    try {

        const find_comment = await CommentModel.findById(commentId)

        if(!find_comment){
            return resp.status(403).send({
                status: 0,
                message: 'comment not exist',
            })
        }

        // console.log(find_comment)

        const delete_comments = await CommentModel.findByIdAndRemove(commentId)
        
        resp.status(200).send({
            status: 1,
            message: ' Comment Delete Successfully',
            comment_delete: delete_comments
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }

}