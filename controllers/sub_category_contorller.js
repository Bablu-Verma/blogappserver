import CategoryModel from "../models/category_model.js"
import SubCategoryModel from "../models/sub_category_model.js"

export const AddSubCategory = async (req, resp) => {
    const { name, categoryId } = req.body

    if (!name) {
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'Enter Sub Category Name',
        })
    }
    if (!categoryId) {
        return resp.status(422).send({
            code: 0,
            status: 0,
            message: 'Enter Category Id',
        })
    }

    try {

        const find_category = await CategoryModel.findById(categoryId)

        console.log(find_category)

        if (!find_category) {
            return resp.status(200).send({
                code: 0,
                status: 0,
                message: ' Category Not Exite',
            })
        }

        const find_sub_category = await SubCategoryModel.findOne({ name, categoryId })

        if (find_sub_category) {
            return resp.status(200).send({
                code: 0,
                status: 0,
                message: 'this sub Category Already Exite',
                category: find_sub_category
            })
        }

        const create_sub_category = SubCategoryModel({
            name, categoryId, categoryName: find_category.name
        })

        const save_create_sub_category = await create_sub_category.save()

        resp.status(201).send({
            status: 1,
            message: 'Create sub Category Successfully',
            create_sub_category: save_create_sub_category
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const SubCategoryList = async (req, resp) => {

    const {categoryId} = req.body

    if(!categoryId){
        return resp.status(403).send({
            code: 0,
            status: 0,
            message: 'Enter Category Id',
        })
    }

    try {
        const find_sub_category = await SubCategoryModel.find({categoryId})

        if (find_sub_category.length == 0) {
            return resp.status(200).send({
                code: 0,
                status: 0,
                message: 'No Sub Category Found',
            })
        }

        resp.status(200).send({
            status: 1,
            message: ' sub Category List',
            sub_category_length: find_sub_category.length,
            sub_category: find_sub_category
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}

export const DeleteSubCategory = async (req, resp) => {
   
    const { id } = req.body
    
    if (!id) {
        return resp.status(200).send({
            code: 0,
            status: 0,
            message: 'Add sub Category Id',
        })
    }
    try {

        const delete_sub_category = await SubCategoryModel.findByIdAndRemove(id)

        if (delete_sub_category == null) {
            return resp.status(200).send({
                status: 0,
                delete: 0,
                message: 'No Sub Category Found',

            })
        }

        resp.status(200).send({
            status: 1,
            delete: 1,
            message: 'Sub Category Delete Sucessfull',
            sub_category_delete: delete_sub_category
        })

    } catch (error) {
        resp.status(500).send({
            status: 0,
            message: 'Server Error',
            error
        })
    }
}