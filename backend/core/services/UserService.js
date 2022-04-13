import jwt from 'jsonwebtoken'
import bycrypt from 'bcryptjs'

export function getJwtToken({ ...payLoad }) {
    return jwt.sign(payLoad, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE,
    })
}

export async function hashPassword(password) {
    const SALT = await bycrypt.genSalt(10)
    return await bycrypt.hash(password, SALT)
}
