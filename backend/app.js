import express, {urlencoded} from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import notFoundMiddleware from './core/middleware/notFoundMiddleWare'
import errorHandlerMiddleWare from './core/middleware/errorHandlerMiddleWare'
import flash from 'connect-flash'
import morgan from 'morgan'

import authRouter from './api/auth/routes/auth'
import campaignCategoryRouter from './api/campagin/routes/campaign-category'
import campaign from './api/campagin/routes/campaign'
import adminAuth from './api/admin/routes/auth.js'

import * as path from 'path'
import campaignApplication from './api/campagin/routes/campaign-application.js'
import authorizationMiddleWare from './core/middleware/authorizationMiddleWare.js'
import paymentRoute from "./api/payment/routes/payment.route.js";
import feedbackRoute from "./api/feedback/routes/feedback.route.js";
import {homeView} from "./api/home/controller/home.controller.js";

export const app = express()



// Express App Config
app.use(express.json())
app.use(urlencoded({extended: true}))

app.use(session({

    secret: 'Creator Bit',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge: 24*60*60*60*1000}

}))

app.use(flash())

app.use((req, res, next) =>{
    res.locals.user = req.session.user;
    res.locals.messageInfo =  req.flash()
    next();

})

app.use(express.static('public'))

app.use(express.static(path.join(path.resolve('./'), '..')))
app.use(cookieParser())
app.use(morgan('tiny'))

//View Engine
app.set('view engine', 'ejs')

app.use(fileUpload({useTempFiles: true}))

const BASE_URL = ''
const CAMPAIGN_CATEGORY = BASE_URL + '/campaign-category'
const CAMPAIGN = BASE_URL + '/campaign'
const CAMPAIGN_APPLICATION = BASE_URL + '/campaign-application'
const BANK_DETAIL = BASE_URL + '/bank-detail'
const FEEDBACK = BASE_URL + '/feedback'

app.get('/',homeView)
app.use(CAMPAIGN, campaign)
app.use(CAMPAIGN_CATEGORY, campaignCategoryRouter)
app.use(CAMPAIGN_APPLICATION, authorizationMiddleWare, campaignApplication)
app.use(BANK_DETAIL, paymentRoute)
app.use(FEEDBACK, feedbackRoute)
app.use(BASE_URL, authRouter)


const ADMIN_AUTH = '/admin'
app.use(ADMIN_AUTH,adminAuth)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleWare)
