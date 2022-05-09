import {isValidId, isValidString} from '../../../core/validation/validation'
import {BadRequestException} from '../../../core/exception/index'
import CampaignCategory from '../services/CampaignCategory'
import {StatusCodes} from 'http-status-codes'
import moment from 'moment'

const ccs = new CampaignCategory()

export const create = async (req, res) => {

    const {name, description, image} = req.body

    if (!isValidString(name, 3))
        throw new BadRequestException('Please Provide Valid Name')

    if (!isValidString(description, 10))
        throw new BadRequestException('Please Provide At-Least 10 Characters')

    if (!image)
        throw new BadRequestException('Please Provide Image of Category')

    const category = await ccs.create({name, description, image})


    req.flash('messageInfo',{
        statusCode: StatusCodes.CREATED,
        message: 'Category Created Successfully',
    })
    res.redirect('/admin/dashboard/create/campaign-category')
}



export const update = async (req, res) => {
    const {
        body: {name, description, image},
        params: {categoryId},
    } = req

    if (!categoryId) throw new BadRequestException('Category Id Is Required')

    if (!isValidString(name, 3))
        throw new BadRequestException('Please Provide Valid Name')

    if (!isValidString(description, 10))
        throw new BadRequestException('Please Provide At-Least 10 Characters')

    const category = await ccs.update({
        id: categoryId,
        name,
        description,
        image,
    })


    req.flash('messageInfo',{
        statusCode: StatusCodes.CREATED,
        message: 'Category Updated Successfully',
    })
    res.redirect('/admin/dashboard/show/campaign-category')


}

export const deleteCategory = async (req, res) => {

    const {categoryId} = req.params

    if (!categoryId) throw new BadRequestException('Please Provide Category Id')

    if (!isValidId(categoryId) || !(await ccs.delete(categoryId)))
        throw new BadRequestException('Category Is Not Valid')



    req.flash('messageInfo',{
        statusCode: StatusCodes.OK,
        message: 'Category Delete Successfully',
    })
    res.redirect('/admin/dashboard/show/campaign-category')

}


export const getCategory = async (req, res) => {

    const {categoryId} = req.params

    if (!isValidId(categoryId))
        throw new BadRequestException('Please Provide Category Id')

    const category = await ccs.getCategory(categoryId)

    res.render('user/category-detail.ejs', {
        statusCode: StatusCodes.OK,
        category,
        moment,
        message: 'Category  Detail',
    })
}





export const getAllCategories = async (req, res) => {
    const categories = await ccs.getAllCategory()

    res.json({
        statusCode: StatusCodes.OK,
        data: {categories},
        message: 'Campaign Categories',
    })
}

export const categoryView = async (req, res) => {

    const {categoryId} = req.params

    const categoryDetail = await ccs.getCategory(categoryId)

    res.render('user/category-detail.ejs', {
        category: categoryDetail,
    })
}
