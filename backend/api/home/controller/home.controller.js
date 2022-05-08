import APIFeature from "../../../core/services/APIFeature.js";
import {StatusCodes} from "http-status-codes";
import moment from "moment";
import CampaignService from "../../campagin/services/CampaignService.js";
import CampaignCategory from "../../campagin/services/CampaignCategory.js";


const cs = new CampaignService()
const categoryService = new CampaignCategory()


export const homeView = async (req, res) => {

    const campaigns = await cs.getAllCampaign(
        new APIFeature(req.query).paginate().build(),
    )

    const  categories = await categoryService.getAllCategory()


    res.render('user/index',{
        data: {
            campaigns,
            categories
        },
        moment,
    })
}