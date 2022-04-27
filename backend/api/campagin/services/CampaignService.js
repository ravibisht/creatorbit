import prisma from '@prisma/client'

import {prismaExclude} from 'prisma-exclude'


export default class CampaignService {

    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.db = this.prisma.campaign
        this.exclude = prismaExclude(this.prisma)
    }

    async create(campaign) {
        return this.db.create({data: campaign,})
    }

    async update(campaign) {
        const {
            id,
            userId,
            name,
            shortDesc,
            description,
            startDate,
            endDate,
            image,
            video
        } = {...campaign}

        return this.db.update({
            where: {
                userCampaign: {
                    id,
                    userId
                }
            },
            data: {
                name,
                shortDesc,
                description,
                startDate,
                endDate,
                image,
                video
            },
        })
    }


    async deleteById(id,userId) {
        return this.db.delete({
            userCampaign: {
                id,
                userId
            }
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

     getAllCampaign(data ) {
        return this.db.findMany({
         ...data
        })
    }

     totalCampaign(){
        return this.db.count()
    }
}

