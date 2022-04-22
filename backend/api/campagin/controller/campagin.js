import {StatusCodes} from 'http-status-codes'
import crypto from 'crypto'
import {BadRequestException, NotFoundException} from '../../../core/exception'
import {HttpException} from '../../../core/exception/index'
import {
    isValidEmail,
    isValidName,
    isValidProfilePicture,
    isValidUsername,
    MAX_PROFILE_PICTURE_SIZE,
} from '../../../core/validation/index.js'

import * as path from 'path'

import {
    isValidDate, isValidEndDate,
    isValidImage, isValidStartDate,
    isValidString,
    isValidVideo,
    MAX_CAMPAIGN_IMAGE_SIZE,
    MAX_CAMPAIGN_VIDEO_SIZE
} from "../../../core/validation/validation.js";

const us = new UserService()

export const create = async (req, res) => {

    const campaignParam = req.body

    if (!campaignParam.name || !isValidString(campaignParam.name, 3, 100))
        throw new BadRequestException('Please Provide Valid Name')

    if (!campaignParam.shortDesc || !isValidString(campaignParam.shortDesc))
        throw new BadRequestException('Please Provide Valid Short Description')

    if (!campaignParam.description || !isValidString(campaignParam.description))
        throw new BadRequestException('Please Provide Valid Description')

    if (!isValidStartDate(campaignParam.startDate,new Date()))
        throw new BadRequestException('Please Provide Valid Start Date')

    if (!isValidEndDate(campaignParam.startDate,campaignParam.endDate))
        throw  new BadRequestException('Please Provide Valid End Date')

    if (req.files && req.files.image) {

        const campaignImage = req.files.image

        if (!campaignImage.mimetype.startsWith('image')) throw new BadRequestException('Only Images Are Allowed')

        if (!isValidImage(campaignImage, MAX_CAMPAIGN_IMAGE_SIZE)) throw new BadRequestException(`Max Image  Size ${MAX_CAMPAIGN_IMAGE_SIZE} MB`,)

        const imageName = crypto.randomUUID() + campaignImage.name

        campaignParam.image = process.env.CAMPAGIN_IMAGE_PATH+ path.sep + imageName

        const imageFullPath = path.join(path.resolve('./'), '..', campaignParam.image,)

        await campaignImage.mv(imageFullPath)
    }


    if (req.files && req.files.video) {

        const campaignVideo = req.files.video

        if (!campaignVideo.mimetype.startsWith('video'))
            throw new BadRequestException('Only Videos Are Allowed')

        if (!isValidVideo(campaignVideo, MAX_CAMPAIGN_VIDEO_SIZE))
            throw new BadRequestException(`Max Image  Size ${MAX_CAMPAIGN_VIDEO_SIZE} MB`,)

        const videoName = crypto.randomUUID() + campaignVideo.name

        campaignParam.video = process.env.CAMPAGIN_VIDEO_PATH + videoName

        const videoFullPath = path.join(path.resolve('./'), '..', campaignParam.video,)

        await campaignVideo.mv(videoFullPath)
    }


 const campaign  =
    res.json({
        statusCode: StatusCodes.CREATED,
        message: 'Campaign Created',
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
        'Bearer ' + getJwtToken(user.id),
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

    if (!user)
        throw new HttpException(
            StatusCodes.OK,
            'Reset password has been sent to you registered Mail Id.',
        )

    const resetToken = generateToken()

    const hashToken = createHash(resetToken)
    await us.updateResetToken(user.email, {token: hashToken})

    const resetURL = `${req.protocol}://${req.get('host')}/${
        process.env.BASE_URL
    }reset-password/${resetToken}`
    const message = `Forgot you password ? \n Click link below to change password.\n${resetURL}`
    const subject = `Reset Password`

    try {
        await sendEmail({
            email: user.email,
            subject,
            message,
        })
    } catch (err) {
        console.log(err)
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

    if (!user)
        throw new BadRequestException('Reset password link has been expired.')

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

    res.json(user)
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

    let updatedUser = await us.update(userParam)

    res.json({
        statusCode: StatusCodes.OK,
        message: 'Account Updated',
        data: updatedUser,
    })
}