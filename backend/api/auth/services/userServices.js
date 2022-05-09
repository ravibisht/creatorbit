import prisma from '@prisma/client'
import { BadRequestException } from '../../../core/exception'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prismaExclude } from 'prisma-exclude'
import { NotFoundException } from '../../../core/exception/index.js'

export default class UserService {
    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.userDB = this.prisma.user
        this.exclude = prismaExclude(this.prisma)
    }

    async create(user) {
        const {
            username,
            name,
            bio,
            email,
            mobileNo,
            password,
            profilePicture,
            facebookProfile,
            instagramProfile,
            youtubeProfile,
            role,
        } = { ...user }

        return this.userDB.create({
            data: {
                username,
                name,
                bio,
                email,
                mobileNo,
                password,
                profilePicture,
                facebookProfile,
                instagramProfile,
                youtubeProfile,
                role,
            },
        })
    }

    async update(payload) {
        const {
            id,
            username,
            name,
            bio,
            profilePicture,
            facebookProfile,
            instagramProfile,
            youtubeProfile,
        } = { ...payload }

        return this.userDB.update({
            where: { id },
            data: {
                name,
                // username,
                bio,
                profilePicture,
                facebookProfile,
                instagramProfile,
                youtubeProfile,
            },
            select: this.exclude('user', ['password']),
        })
    }

    getUserById(id) {
        return this.userDB.findUnique({
            where: { id: id },
        })
    }

    async updateResetToken(email, token) {
        return this.userDB.update({
            where: {
                email,
            },
            data: token,
        })
    }

    async findByUsernameWithPassword(username) {
        return this.userDB.findUnique({
            where: {
                username: username,
            },
            // select: this.exclude('user', ['password'])
        })
    }

    async findByUsername(username) {
        if (!username) throw BadRequestException('Please Provide Username')

        return this.userDB.findUnique({
            where: {
                username: username,
            },
            include: {
                BankDetail: true,
            },
        })
    }

    async findByEmail(email) {
        if (!email) throw BadRequestException('Please Provide Email')

        return this.userDB.findUnique({
            where: { email },
        })
    }

    async findOne(param) {
        if (!param) throw new NotFoundException('User Not Found.')
        return this.userDB.findFirst({
            where: param,
        })
    }

    getAllUsers() {
        return this.userDB.findMany()
    }

    getAllUserCount() {
        return this.userDB.count()
    }

    // getUserBetween(fromDate,toDate){
    //     return this.userDB.findMany({
    //         select: {
    //             id: true,
    //             name: true,
    //             username: true,
    //             email: true,
    //             mobileNo: true,
    //             role
    //         }
    //     })
    // }

    getUserBetween(fromDate, toDate) {
        return this.userDB.findMany({
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
            select: this.exclude('user', ['password', 'updateAt']),
        })
    }
}

export function getJwtToken(payLoad) {
    return jwt.sign(
        {
            id: payLoad.id,
            username: payLoad.username,
            role: payLoad.role,
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRE,
        },
    )
}

export async function hashPassword(password) {
    const SALT = await bcrypt.genSalt(10)
    return bcrypt.hash(password, SALT)
}

export async function comparePassword(enteredPassword, dbPassword) {
    return bcrypt.compare(enteredPassword, dbPassword)
}

export function generateToken() {
    return crypto.randomBytes(32).toString('hex')
}
