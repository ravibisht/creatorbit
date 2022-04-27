import {ForbiddenException, UnAuthorizedException} from '../exception'
import jwt from 'jsonwebtoken'
import Role from "../../api/auth/enums/Role";

export default async (req, res, next) => {

    let {authToken} = req.cookies

    if (!authToken || !authToken.startsWith('Bearer ')) throw new UnAuthorizedException(`UnAuthenticated`)

    authToken = authToken.split(' ')[1]

    let decodedData

    try {
        decodedData = jwt.verify(authToken, process.env.JWT_TOKEN_SECRET)
    } catch (err) {
        throw new UnAuthorizedException(`Authentication Failed.`)
    }

    if (!decodedData.id) throw new UnAuthorizedException(`Authentication Failed.`)

    req.user = {
        id: decodedData.id ,
        username : decodedData.username,
        role : decodedData.role
    }

    next()
}


export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(Role.valueOf(req.user.role))) throw new ForbiddenException("You Don't Have Permission to Access this Route.")
        next()
    }
}
