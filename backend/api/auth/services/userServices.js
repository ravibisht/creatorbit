import prisma from '@prisma/client'
import { BadRequestException } from '../../../core/exception'
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'
import { prismaExclude } from 'prisma-exclude'

export default class UserService {
    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.userDB = this.prisma.user
        this.exclude = prismaExclude(this.prisma)
    }

    async create(user) {
        return this.userDB.create({ data: user })
    }

    async update(payload) {
        const {
            username,
            name,
            bio,
            profilePicture,
            facebookProfile,
            instagramProfile,
            youtubeProfile,
        } = { ...payload }

        if (username) {
            this.findUnique(username)
        }

        return await this.userDB.update({
            where: { id },
            data: {
                name,
                bio,
                profilePicture,
                facebookProfile,
                instagramProfile,
                youtubeProfile,
            },
        })
    }

    async updateToken(email, token) {
        return this.userDB.update({
            where: {
                email,
            },
            data: { token },
        })
    }

    async findByUsernameWithPassword(username) {
        if (!username) throw BadRequestException('Please Provide Username')

        return this.userDB.findUnique({
            where: {
                username: username,
            },
        })
    }

    async getUserByUserName(username) {
        if (!username) throw BadRequestException('Please Provide Username')

        return this.userDB.findUnique({
            where: {
                username: username,
            },
            select: this.exclude('user', ['password', 'token', 'status']),
        })
    }

    async findByEmail(email) {
        if (!email) throw BadRequestException('Please Provide Email')

        return this.userDB.findUnique({
            where: { email },
        })
    }
}

export function getJwtToken(payLoad) {
    return jwt.sign({ payLoad }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE,
    })
}

export async function hashPassword(password) {
    const SALT = await bycrypt.genSalt(10)
    return bycrypt.hash(password, SALT)
}

export async function comparePassword(enteredPassword, dbPassword) {
    return bycrypt.compare(enteredPassword, dbPassword)
}
