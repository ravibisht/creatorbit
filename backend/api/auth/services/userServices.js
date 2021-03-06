import prisma from '@prisma/client'
import {BadRequestException} from '../../../core/exception'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import {prismaExclude} from 'prisma-exclude'
import {NotFoundException} from '../../../core/exception/index.js'

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
        } = {...user}

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
            }
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
        } = {...payload}

        return this.userDB.update({
            where: {id},
            data: {
                name,
                username,
                bio,
                profilePicture,
                facebookProfile,
                instagramProfile,
                youtubeProfile,
            },
            select: this.exclude('user', ['password']),
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
            select: this.exclude('user', ['password', 'token', 'status']),
        })
    }

    async findByEmail(email) {
        if (!email) throw BadRequestException('Please Provide Email')

        return this.userDB.findUnique({
            where: {email},
        })
    }

    async findOne(param) {
        if (!param) throw new NotFoundException('User Not Found.')
        return this.userDB.findFirst({
            where: param,
        })
    }
}

export function getJwtToken(payLoad) {
    return jwt.sign({
            id: payLoad.id,
            username: payLoad.username,
            role: payLoad.role
        },
        process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TOKEN_EXPIRE,
        })
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
