import dotenv from "dotenv"
import blogModel from "../models/blog_model.js"
import jwt from "jsonwebtoken"
import slugify from "slugify"


dotenv.config()
const secretKey = process.env.secretKey

export const AddBlog = async (req, resp) => {
    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);

    const { title, subTitle, text } = req.body
    const Profile = req.file?.filename || null

    if (!title) {
        return resp.status(422).send({
            status: 0,
            message: ' Add Blog title',
        })
    }
    if (!subTitle) {
        return resp.status(422).send({
            status: 0,
            message: ' Add Sub Title title',
        })
    }
    if (!text) {
        return resp.status(422).send({
            status: 0,
            message: ' Add Your Blog',
        })
    }

    try {
        const create_slug = slugify(title)

        const add_blog = blogModel({
            title, subTitle, text, image: Profile, userId: decodedToken.id, slug: create_slug
        })

        const save_add_blog = await add_blog.save()
        resp.status(201).send({
            status: 1,
            message: 'Blog Add Successfully',
            blog: save_add_blog
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const ListUserBlog = async (req, resp) => {
    const authorization = req.headers['authorization'];
    const decodedToken = jwt.verify(authorization, secretKey);

    try {

        const userBlog = await blogModel.find({ userId: decodedToken.id })

        resp.status(200).send({
            status: 1,
            creater: 1,
            message: 'User Blog List',
            userBlog: userBlog
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const AllBlog = async (req, resp) => {
    const authorization = req.headers['authorization'] || null

    let decodedToken
    if (authorization != null) {
        decodedToken = jwt.verify(authorization, secretKey);
    }
    try {

        if (decodedToken == undefined) {
            const userBlog = await blogModel.find({})
            resp.status(200).send({
                status: 1,
                userlogin: 0,
                message: 'All Blog List',
                userBlog: userBlog
            })
        } else {
            const userBlog = await blogModel.find({})
            const newArray = userBlog.map((item) => {
                return ({
                    title: item.title,
                    subTitle: item.subTitle,
                    image: item.image,
                    text: item.text,
                    id: item._id,
                    slug: item.slug,
                    creater: item.userId == decodedToken.id ? 1 : 0
                })
            })

            // console.log(userBlog)

            resp.status(200).send({
                status: 1,
                userlogin: 1,
                message: 'All Blog List',
                blog: newArray
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

export const BlogDetails = async (req, resp) => {
    const authorization = req.headers['authorization'] || null
    const { slug } = req.params

    let decodedToken
    if (authorization != null) {
        decodedToken = jwt.verify(authorization, secretKey);
    }


    try {

        if (decodedToken == undefined) {
            const blog_detail = await blogModel.findOne({ slug })
            resp.status(200).send({
                status: 1,
                userlogin: 0,
                message: 'blog details',
                blog_detail: blog_detail
            })
        } else {
            const blog_detail = await blogModel.findOne({ slug })

            // console.log(userBlog)
            resp.status(200).send({
                status: 1,
                userlogin: 1,
                creater: blog_detail.userId == decodedToken.id ? 1 : 0,
                message: 'blog details',
                blog: blog_detail
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

export const EditBlog = async (req, resp) => {
    const authorization = req.headers['authorization'] || null

    const { id, title, subTitle, text } = req.body
    const Profile = req.file?.filename || null
    const decodedToken = jwt.verify(authorization, secretKey);

    if (!id) {
        return resp.status(422).send({
            status: 0,
            message: '  Add Blog Id',
        })
    }
    if (!title) {
        return resp.status(422).send({
            status: 0,
            message: ' Add Blog title',
        })
    }
    if (!subTitle) {
        return resp.status(422).send({
            status: 0,
            message: ' Add Sub Title title',
        })
    }
    if (!text) {
        return resp.status(422).send({
            status: 0,
            message: ' Add Your Blog',
        })
    }

    try {
        const findBlog = await blogModel.findById(id)
        if (!findBlog) {
            return resp.status(401).send({
                status: 0,
                message: 'Blog Not Found Try again',
            })
        }

        if (findBlog.userId != decodedToken.id) {
            return resp.status(401).send({
                status: 0,
                message: "You Can't Edit This Blog",
            })
        }

        const create_slug = slugify(title)

        if (Profile == null) {
            const UpdateBlog = await blogModel.findByIdAndUpdate({ _id: id }, { title, subTitle, text, slug: create_slug }, { new: true })
            // console.log(UpdateBlog)
            return resp.status(200).send({
                status: 1,
                message: 'blog edit sucessfull',
                UpdateBlog
            })
        } else {
            const UpdateBlog = await blogModel.findByIdAndUpdate({ _id: id }, { title, subTitle, text, slug: create_slug, image: Profile }, { new: true })
            // console.log(UpdateBlog)
            return resp.status(200).send({
                status: 1,
                message: 'blog edit sucessfull',
                UpdateBlog
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

export const DeleteBlog = async (req, resp) => {
    const authorization = req.headers['authorization'] || null
    const { id } = req.body
    const decodedToken = jwt.verify(authorization, secretKey);

    if (!id) {
        return resp.status(422).send({
            status: 0,
            message: 'Add Blog Id',
        })
    }


    try {
        const findBlog = await blogModel.findById(id)

        if (!findBlog) {
            return resp.status(401).send({
                status: 0,
                message: 'Blog Not Found Try again',
            })
        }

        if (findBlog.userId != decodedToken.id) {
            return resp.status(401).send({
                status: 0,
                message: "You Can't Delete This Blog",
            })
        }
        const delete_blog = await blogModel.findByIdAndRemove(id)

        return resp.status(200).send({
            status: 1,
            message: 'blog delete sucessfull',
            delete_blog
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const BlogSearch = async (req, resp) => {
    const { search } = req.body

    if(!search){
        return resp.status(422).send({
            status: 0,
            message: 'Enter Search Key..', 
        })
    }

    try {

        const find_blog = await blogModel.find({
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { subTitle: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
            ],
        })

        if (find_blog.length == 0) {
            return resp.status(200).send({
                status: 1,
                message: 'No Blog Found',
                search_length:find_blog.length,
                search: find_blog
            })
        }

       const  search_result =  find_blog.map((item)=>{
         return {
            title:item.title,
            slug : item.slug,
            subTitle:item.subTitle,
            id:item._id
         }
       })
        resp.status(200).send({
            status: 1,
            message: 'blog Search result',
            search_length:find_blog.length,
            search: search_result
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const FilterBlog = async (req, resp) => {

    const { date, author } = req.query;
     console.log(date)

    const filter = {}
    
    if (date) {
        filter.updatedAt = { $gte: new Date(date) };
    }

    if (author) {
        filter.userId = author;
    }
    // console.log(filter)

    try {
        const find_blog = await blogModel.find(filter)

        if (find_blog.length == 0) {
            return resp.status(200).send({
                status: 1,
                message: 'No Blog Found',
                search_length:find_blog.length,
                search: find_blog
            })
        }

        resp.status(200).send({
            status: 1,
            message: 'blog Search result',
            search_length:find_blog.length,
            search: find_blog
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const DeleteBlogByAdmin = async (req, resp)=>{

 const {id} = req.body
    if (!id) {
        return resp.status(422).send({
            status: 0,
            message: 'Add Blog Id',
        })
    }

    try {
        const findBlog = await blogModel.findById(id)

        if (!findBlog) {
            return resp.status(401).send({
                status: 0,
                message: 'Blog Not Found Try again',
            })
        }
        const delete_blog = await blogModel.findByIdAndRemove(id)

        return resp.status(200).send({
            status: 1,
            message: 'blog delete sucessfull',
            delete_blog
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}