import CategoryModel from "../models/category_model.js"


export const AddCategory =  async (req, resp)=>{
    const {name} = req.body

    if(!name){
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'Enter Category Name',
        })
    }
    try {

        const find_category = await CategoryModel.findOne({name})

        if(find_category){
            return resp.status(200).send({
                code: 0,
                status: 0,
                message: 'this Category Already Exite',
                category:find_category
            })
        }

        const create_category = CategoryModel({
            name
        })

        const save_create_category = await create_category.save()

        resp.status(201).send({
            status: 1,
            message: 'Create Category Successfully',
            create_category: save_create_category
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const CategoryList =  async (req, resp)=>{

    try {

        const find_category = await CategoryModel.find()

        if( find_category.length == 0 ){
            return resp.status(200).send({
                code: 0,
                status: 0,
                message: 'No Category Found',
            })
        }
        
        resp.status(201).send({
            status: 1,
            message: ' Category List',
            category_length:find_category.length,
            category: find_category
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const DeleteCategory =  async (req, resp)=>{
    const {id} = req.body
    if(!id){
        return resp.status(200).send({
            code: 0,
            status: 0,
            message: 'Add Category Id',
        })
    }
    try {

        const delete_category = await CategoryModel.findByIdAndRemove(id)

        if(delete_category == null){
           return resp.status(200).send({
                status: 0,
                delete:0,
                message: 'No Category Found',
                
            })
        }

        resp.status(200).send({
            status: 1,
            delete:1,
            message: 'Category Delete Sucessfull',
            category_delete: delete_category
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}