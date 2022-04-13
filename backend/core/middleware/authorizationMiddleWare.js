import { UnAuthroziedException } from '../exception'
import jwt from 'jsonwebtoken'

export default (err, req, res, next) => {
    const { authToken } = req.cookie

    if (!authToken && authToken.startsWith('Bearer '))
        throw UnAuthroziedException(`Please Login To Access This Page.`)

    try {
        const decodedData = jwt.verify(authToken, process.env.JWT_TOKEN_SECRET)

        if (!decodedData) throw UnAuthroziedException(`Authentication Failed.`)

        req.user = { id: decodedData.id }
    } catch (err) {
        throw UnAuthroziedException(`Authentication Failed.`)
    }
}
