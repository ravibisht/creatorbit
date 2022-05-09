import prisma from '@prisma/client'

import { prismaExclude } from 'prisma-exclude'

export default class FeedbackService {
    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.db = this.prisma.feedback
        this.exclude = prismaExclude(this.prisma)
    }

    async create(feedback) {
        return this.db.create({
            data: feedback,
        })
    }


    async deleteById(id) {
        return this.db.delete({
            where: { id: id },
        })
    }

    getAllFeedback() {
        return this.db.findMany()
    }

    getAllFeedbackCount(){
        return this.db.count()
    }

    getFeedbackBetween(fromDate, toDate) {
        return this.db.findMany({
            where: {
                contactDate: {
                    gte: new Date(fromDate),
                },
            },
        })
    }

}
