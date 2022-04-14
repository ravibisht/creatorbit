import prisma from '@prisma/client'
import { PrismaClientValidationError } from '@prisma/client/runtime'
import { BadRequestException } from '../../../core/exception'
import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'

export default class UserService {
    userDB = new prisma.PrismaClient().user
    constructor() {
        this.userDB = new prisma.PrismaClient().user
    }

    async create(user) {
        return await this.userDB.create({ data: user })
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

    async findByUsername(username) {
        if (!username) throw BadRequestException('Please Provide Username')

        return await this.userDB.findUnique({
            where: {
                username: username,
            },
        })
    }
}

export function getJwtToken(payLoad) {
    return jwt.sign({payLoad}, process.env.JWT_TOKEN_SECRET, {
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
