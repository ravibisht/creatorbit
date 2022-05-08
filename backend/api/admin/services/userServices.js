import prisma from '@prisma/client'
import {BadRequestException} from '../../../core/exception'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import {prismaExclude} from 'prisma-exclude'
import {NotFoundException} from '../../../core/exception/index.js'

export default class AdminUserService {
    constructor() {
        this.prisma = new prisma.PrismaClient()
        this.userDB = this.prisma.admin
        this.exclude = prismaExclude(this.prisma)
    }



    getUserById(id) {
        return this.userDB.findUnique({
            where: {id: id},
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
                BankDetail: true
            },
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
