import {StatusCodes} from 'http-status-codes'
import {BadRequestException} from '../../../core/exception'
import AdminUserService, {comparePassword, getJwtToken,} from '../services/userServices'

const adminUserService = new AdminUserService()


export const loginView = (req, res) => {
    res.render('admin/login.ejs')
}



export const login = async (req, res) => {

    const {username, password} = req.body

    if (!username || !password)
        throw new BadRequestException('Please Provide Username or Password')

    const user = await adminUserService.findByUsernameWithPassword(username)

    if (!user || !(await comparePassword(password, user.password)))
        throw new BadRequestException('Your Username or Password is Incorrect')

    const cookieOption = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,),
        httpOnly: true,
    }

    req.session.user = user

    req.flash("messageInfo" ,{
        message: "Logged In Successfully",
        statusCode: StatusCodes.OK
    })

    res.cookie(
        'authToken',
        'Bearer ' + getJwtToken({...user}),
        cookieOption,
    ).redirect('/')
}



export const logout = (req, res) => {

    req.session.destroy()
    res.redirect('/login',)
}
