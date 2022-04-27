import prisma from '@prisma/client'

export default class CampaignCategory {
    constructor() {
        this.db = new prisma.PrismaClient().campaignCategories
    }

    async create(category) {
        return this.db.create({data: category})
    }

    async update(category) {
        const {id, name, description, image} = category
        return this.db.update({
            where: {id: Number(id)}, data: {name, description, image},
        })
    }

    async findAndUpdate(category) {
        const {id, userId, name, description, image} = category
        return this.db.update({
            where: {
                id: Number(id),
                userId: Number(userId)
            }, data: {name, description, image},
        })
    }

    async delete(id) {
        return this.db.delete({
            where: {id: Number(id)},
        })
    }

    async getCategory(categoryId) {
        return this.db.findUnique({
            where: {id: Number(categoryId)}
        })
    }

    async getAllCategory() {
        return this.db.findMany()
    }
}
