import prisma from '@prisma/client'

import { prismaExclude } from 'prisma-exclude'

export default class PaymentService {
    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.db = this.prisma.bankDetail
        this.exclude = prismaExclude(this.prisma)
    }

    async create(bankDetail) {
        return this.db.create({
            data: bankDetail,
        })
    }

    async update(bankDetail) {
        const { id, userId, accountNo, IFSCCode, accountName } = {
            ...bankDetail,
        }

        return this.db.update({
            where: {
                userBankDetail: {
                    id,
                    userId,
                },
            },
            data: {
                accountNo,
                IFSCCode,
                accountName,
            },
        })
    }

    async deleteById(id) {
        return this.db.delete({
            where: { id: id },
        })
    }

    async findById(id) {
        return this.db.findUnique({
            where: { id },
            include: {
                user: true,
            },
        })
    }

    async findByUserId(userId) {
        return this.db.findFirst({
            where: { userId: userId },
            include: {
                user: true,
            },
        })
    }

    getAllBankDetail(data) {
        return this.db.findMany({
            include: {
                user: true,
            },
        })
    }
}
