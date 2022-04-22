import prisma from '@prisma/client'

import {prismaExclude} from 'prisma-exclude'


export default class CampaignService {

    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.db = this.prisma.campaign
        this.exclude = prismaExclude(this.prisma)
    }

    async create(campaign) {
        return this.db.create({data: campaign})
    }

    async update(campaign) {
        const {
            id,
            name,
            campaignCategoriesId,
            shortDesc,
            description,
            startDate,
            endDate,
            campaignPlatforms,
        } = {...campaign}

        return this.db.update({
            where: {id},
            data: {
                name,
                campaignCategoriesId,
                shortDesc,
                description,
                startDate,
                endDate,
                campaignPlatforms,
            },
        })
    }


    async findById(id) {
        return this.db.findUnique({
            where: {id},
        })
    }

    async findOne(param) {
        return this.db.findFirst({
            where: param,
        })
    }
}

