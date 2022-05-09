import prisma from '@prisma/client'


export default class CampaignApplicationService {

    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.db = this.prisma.campaignApplication
    }

    create(campaignApplication) {
        return this.db.create({
            data: campaignApplication,
        })
    }

    update(campaignApplication) {
        const {
            id,
            userId,
            campaignId,
            applicationStatus,
            paymentStatus,

        } = {...campaignApplication}

        return this.db.update({
            where: {
                id,
            },
            data: {
                campaign: {
                    connect: {
                        userCampaign: { id: campaignId, userId}
                    }
                },
                applicationStatus,
                paymentStatus
            }
        })
    }


    deleteById(id, userId, campaignId) {
        return this.db.delete({
            userCampaignApplication: {
                id,
                userId,
                campaignId
            }
        })
    }

    findById(id) {
        return this.db.findUnique({
            where: {id},
        })
    }

    findOne(param) {
        return this.db.findFirst({
            where: param,
        })
    }

    getCampaignByUserId(userId, applicationStatus, paymentStatus) {
        return this.db.findMany({
            where: {
                userId,
                applicationStatus,
                paymentStatus
            },
            include: {
                campaign: true
            }
        })
    }


    getCampaignByOwnerId(userId, applicationStatus, paymentStatus) {
        return this.db.findMany({
            where: {
                applicationStatus,
                paymentStatus,
                campaign: {
                    userId: {
                          equals: userId
                    }
                }
            },
            include: {
                campaign: true,
                user:true
            }
        })
    }

    getAllCampaignApplication() {
        return this.db.findMany({})
    }

    getAllCampaignApplicationCount(){
        return this.db.count()
    }

}

