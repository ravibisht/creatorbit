import { UnAuthroziedException } from '../exception'
import jwt from 'jsonwebtoken'

export default async (req, res, next) => {
    let { authToken } = req.cookies

    if (!authToken || !authToken.startsWith('Bearer ')) throw new UnAuthroziedException(`UnAuthenticated`)

    authToken = authToken.split(' ')[1]

    let decodedData

    try {
        decodedData = jwt.verify(authToken, process.env.JWT_TOKEN_SECRET)
    } catch (err) {
        throw new UnAuthroziedException(`Authentication Failed.`)
    }

    if (!decodedData.id) throw new UnAuthroziedException(`Authentication Failed.`)

    req.user = { id: decodedData.id }

    next()
}
