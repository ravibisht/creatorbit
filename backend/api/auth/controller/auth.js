import { StatusCodes } from 'http-status-codes'
import { BadRequestException, NotFoundException } from '../../../core/exception'
import Role from '../enums/Role'
import UserService, {
    hashPassword,
    getJwtToken,
    comparePassword,
    findByEmail,
} from '../services/userServices'

const us = new UserService()

export const register = async (req, res) => {
    let userParam,
        { role, companyName } = req.body

    if (role === Role.BRAND && !companyName)
        throw new BadRequestException('Company Name is Required')

    userParam['password'] = await hashPassword(userParam.password)

    let createdUser = await us.create(userParam)

    res.status(StatusCodes.CREATED).json({
        statusCode: StatusCodes.CREATED,
        message: 'Account Created',
        data: createdUser,
    })
}

export const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password)
        throw new BadRequestException('Please Provide Username or Password')

    const user = await us.findByUsernameWithPassword(username)

    if (!user || !(await comparePassword(password, user.password)))
        throw new BadRequestException('Your Username or Password is Incorrect')

    const cookieOption = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    }

    res.cookie('token', getJwtToken('user.id'), cookieOption).json({
        data: { user },
        message: 'Account Created',
        statusCode: StatusCodes.OK,
    })
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body

    if (!email) throw new BadRequestException(`Please Provide Valid Email`)

    const user = await findByEmail(email)

    if (!user) throw new BadRequestException('Please Provide Valid Email')

    user.
    res.json()
}

export const getUserByUsername = async (req, res) => {
    const { username } = req.params

    if (!username) throw new NotFoundException(`User Not Found`)

    const user = await us.getUserByUserName(username)

    res.json(user)
}
