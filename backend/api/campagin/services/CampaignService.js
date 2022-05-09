import prisma from '@prisma/client'

import {prismaExclude} from 'prisma-exclude'

export default class CampaignService {
    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.db = this.prisma.campaign
        this.exclude = prismaExclude(this.prisma)
    }

    async create(campaign) {
        const {
            campaignCategoryId,
            userId,
            name,
            price,
            shortDesc,
            description,
            startDate,
            endDate,
            image,
            video,

        } = {...campaign}
        return this.db.create({
            data: {
                campaignCategoryId,
                userId,
                name,
                price,
                shortDesc,
                description,
                startDate,
                endDate,
                image,
                video,
            }
        })
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
            video,
        } = {...campaign}

        return this.db.update({
            where: {
                userCampaign: {
                    id,
                    userId,
                },
            },
            data: {
                name,
                shortDesc,
                description,
                startDate,
                endDate,
                image,
                video,
            },
        })
    }

    async deleteById(id, userId) {
        return this.db.delete({
            userCampaign: {
                id,
                userId,
            },
        })
    }

    async findById(id) {
        return this.db.findUnique({
            where: {id},
            include: {
                user: true,
                CampaignPlatforms: true,
                CampaignApplication:{
                   select:{
                       user:true,
                       id:true,
                       applicationStatus:true,
                       paymentStatus:true
                   }

                },
                campaign: true,
            },
        })
    }

    async findOne(param) {
        return this.db.findFirst({
            where: param,
        })
    }

    getAllCampaign(data) {
        return this.db.findMany({
            ...data,
            include: {
                campaign: true,
            },
        })
    }

    getCampaignByUserId(userId) {
        return this.db.findMany({
            where : {
                userId:userId
            },
            include:{
                campaign:true,
                user:true,
                CampaignPlatforms: true
            }
        })
    }

    getCampaignCount() {
        return this.db.count()
    }

    getCampaignBetween(fromDate, toDate) {
        return this.db.findMany({
            where: {
                AND: [
                    {
                        createdAt: {
                            gte: new Date(fromDate),
                        },
                    },
                    {
                        createdAt: {
                            lte: new Date(toDate),
                        },
                    },
                ],
            },
            include:{
                campaign:true
            }
        })
    }
}
