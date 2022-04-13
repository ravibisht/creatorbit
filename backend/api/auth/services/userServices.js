import prisma from '@prisma/client'

export default class UserService {
    userDB = null
    constructor() {
        this.userDB = new prisma.PrismaClient()
    }

    async create(user) {
        return await new prisma.PrismaClient().user.create({ data: user })
    }
}
