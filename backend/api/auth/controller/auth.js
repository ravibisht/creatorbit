import { StatusCodes } from 'http-status-codes'
import { BadRequestException } from '../../../core/exception'
import UserService, {
    hashPassword,
    getJwtToken,
    comparePassword,
} from '../services/userServices'

let us = new UserService()

export const register = async (req, res) => {
    let newUser1 = req.body
    newUser1['password'] = await hashPassword(newUser1.password)
    let newUser = us.create(newUser1)
    res.status(StatusCodes.CREATED).json({ data: newUser })
}

export const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        throw new BadRequestException('Please Provide Username or Password')

    const user = await us.findByUsername(username)

    if (!user || !(await comparePassword(password, user.password)))
        throw new BadRequestException('Your Username or Password is Incorrect')

    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    }

    res.status(StatusCodes.OK)
        .cookie('token', getJwtToken('user.id'), cookieOption)
        .json({
            data: { user },
        })
}
