import {isValidString} from "../../../core/validation/validation";
import {BadRequestException} from "../../../core/exception/index";
import CampaignCategory from "../services/CampaignCategory";
import crypto from "crypto";
import path from "path";
import {StatusCodes} from "http-status-codes";

const ccs = new CampaignCategory()

export const create = async (req, res) => {

    const {name, description} = req.body

    if (!isValidString(name, 3)) throw new BadRequestException('Please Provide Valid Name')

    if (!isValidString(description, 10)) throw new BadRequestException('Please Provide At-Least 10 Characters')

    if (!req.files || !req.files.image) throw  new BadRequestException('Please Provide Image of Category')

    const image = req.files.image

    const categoryImageName = crypto.randomUUID() + image.name
    const imagePath = process.env.CAMPAGIN_CATEGORY_IMAGE_PATH + categoryImageName
    const imageFullPath = path.join(path.resolve('./'), '..', imagePath,)

    await image.mv(imageFullPath)
    const category = await ccs.create({name, description, image: imagePath})

    res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'Category Created Successfully',
        data: {category}
    })

}


export const update = async (req, res) => {

    const {
        body: {name, description},
        params: { categoryId }
    } = req

    let imagePath = null

    if (!categoryId) throw new BadRequestException('Category Id Is Required')

    if (!isValidString(name, 3)) throw new BadRequestException('Please Provide Valid Name')

    if (!isValidString(description, 10)) throw new BadRequestException('Please Provide At-Least 10 Characters')

    if (req.files && req.files.image) {

        const image = req.files.image
        const categoryImageName = crypto.randomUUID() + image.name
        imagePath = process.env.CAMPAGIN_CATEGORY_IMAGE_PATH + categoryImageName
        const imageFullPath = path.join(path.resolve('./'), '..', imagePath,)

        await image.mv(imageFullPath)
    }


    const category = await ccs.update({id: categoryId, name, description, image: imagePath})

    res.json({
        statusCode: StatusCodes.OK,
        data: {category},
        message: 'Category Updated Successfully'
    })

}


export const deleteCategory = async (req, res) => {

    const {categoryId} = req.params

    if (!categoryId) throw  new BadRequestException('Please Provide Category Id')

    if (!await ccs.delete(categoryId)) throw new BadRequestException('Category Is Not Valid')

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Category Delete Successfully',
    })
}

export  const getCategory = async (req,res)=>{

    const {categoryId} = req.params

    if (!categoryId) throw  new BadRequestException('Please Provide Category Id')

    const category =  await ccs.getCategory(categoryId)

    res.json({
        statusCode: StatusCodes.OK,
        data : category,
        message: 'Category Delete Successfully',
    })
}

export const getAllCategories = async (req, res) => {
    const categories = await ccs.getAllCategory()

    res.json({

        statusCode: StatusCodes.OK,
        data: {categories},
        message: 'Campaign Categories'

    })

}

