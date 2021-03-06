import {StatusCodes} from 'http-status-codes'
import crypto from 'crypto'
import {BadRequestException, NotFoundException} from '../../../core/exception'
import UserService, {comparePassword, generateToken, getJwtToken, hashPassword,} from '../services/userServices'
import {HttpException} from '../../../core/exception/index.js'
import {createHash} from '../../../core/util/hash.js'
import sendEmail from '../../../core/util/email.js'
import {
    isValidEmail,
    isValidName,
    isValidPassword,
    isValidProfilePicture,
    isValidUsername,
    MAX_PROFILE_PICTURE_SIZE,
} from '../../../core/validation/index.js'
import * as path from 'path'
import {isValidString} from "../../../core/validation/validation.js";

const us = new UserService()

export const register = async (req, res) => {

    const userParam = req.body

    if (!userParam.username || !isValidUsername(userParam.username))
        throw new BadRequestException('Please Provide Valid Username')

    if (!userParam.password || !isValidPassword(userParam.password))
        throw new BadRequestException('Please Provide Valid Password')

    if (!userParam.name || !isValidName(userParam.name))
        throw new BadRequestException('Please Provide Valid Name')

    if (!userParam.email || !isValidEmail(userParam.email))
        throw new BadRequestException('Please provide Valid Email')

    if (!userParam.mobileNo || !isValidString(userParam.mobileNo, 10))
        throw new BadRequestException('Please provide Valid Mobile No')

    const currentUsr = await us.findByUsername(userParam.username)

    if (currentUsr) throw new BadRequestException('Username Already Exists')

    const currentUser = await us.findByEmail(userParam.email)

    if (currentUser) throw new BadRequestException('Email Already Exists')

    userParam['password'] = await hashPassword(userParam.password)

    let createdUser = await us.create(userParam)
    delete createdUser['password']

    res.json({
        statusCode: StatusCodes.CREATED,
        message: 'Account Created',
        data: createdUser,
    })
}


export const login = async (req, res) => {

    const {username, password} = req.body

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

    res.cookie(
        'authToken',
        'Bearer ' + getJwtToken({...user}),
        cookieOption,
    ).json({
        data: {user},
        message: 'Logged in Successfully',
        statusCode: StatusCodes.OK,
    })
}


export const forgotPassword = async (req, res) => {

    const {email} = req.body

    if (!email) throw new BadRequestException(`Please Provide Valid Email`)

    const user = await us.findByEmail(email)

    if (!user) throw new BadRequestException('Account does not exist with this email.')

    const resetToken = generateToken()

    const hashToken = createHash(resetToken)

    await us.updateResetToken(user.email, {token: hashToken})

    const resetURL = `${req.protocol}://${req.get('host')}/${
        process.env.BASE_URL
    }reset-password/${resetToken}`
    const message = `Forgot you password ? \n Click link below to change password.\n${resetURL}`
    const subject = `Reset Password`

    try {
        await sendEmail({email: user.email, subject, message,})
    } catch (err) {

        throw new HttpException(
            StatusCodes.INTERNAL_SERVER_ERROR,
            'Something went Wrong.',
        )
    }

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Reset password has been sent to you registered Mail Id.',
        token: resetToken,
    })
}

export const resetPassword = async (req, res) => {
    const {token} = req.params

    const hashedToken = createHash(token)

    const user = await us.findOne({token: hashedToken})

    if (!user) throw new BadRequestException('Reset password link has been expired.')

    const {password} = req.body

    if (!password) throw new BadRequestException('Please provide password.')

    const hashedPassword = await hashPassword(password)

    await us.updateResetToken(user.email, {
        password: hashedPassword,
        token: '',
    })

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Password reset successfully.',
    })
}

export const getUserByUsername = async (req, res) => {
    const {username} = req.params

    if (!username) throw new NotFoundException(`User Not Found`)

    const user = await us.findByUsername(username)
    if (!user) throw new NotFoundException(`User Not Found With Username : ${username}`)

    res.json({
        statusCode: StatusCodes.OK,
        message: 'User Detail',
        data: user
    })
}

export const updateProfile = async (req, res) => {

    const userParam = req.body

    userParam.id = req.user.id

    if (userParam.username && !isValidUsername(userParam.username))
        throw new BadRequestException('Please Provide Valid Username')

    if (userParam.name && !isValidName(userParam.name))
        throw new BadRequestException('Please Provide Valid Name')

    if (userParam.email && !isValidEmail(userParam.email))
        throw new BadRequestException('Please provide Valid Email')

    if (userParam.username) {
        const currentUsr = await us.findByUsername(userParam.username)
        if (currentUsr) throw new BadRequestException('Username Already Exists')
    }

    if (userParam.email) {
        const currentUser = await us.findByEmail(userParam.email)
        if (currentUser) throw new BadRequestException('Email Already Exists')
    }

    if (req.files && req.files.profilePicture) {
        const profilePicture = req.files.profilePicture

        if (!profilePicture.mimetype.startsWith('image'))
            throw new BadRequestException('Only Images Are Allowed')

        if (!isValidProfilePicture(profilePicture))
            throw new BadRequestException(
                `Max Profile Picture Size ${MAX_PROFILE_PICTURE_SIZE / 1024} `,
            )

        const imageName = crypto.randomUUID() + profilePicture.name

        userParam.profilePicture = process.env.USER_IMAGE_PATH + imageName

        const imageFullPath = path.join(
            path.resolve('./'),
            '..',
            userParam.profilePicture,
        )
        await profilePicture.mv(imageFullPath)
    }

    const updatedUser = await us.update(userParam)

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Account Updated',
        data: updatedUser,
    })
}
