import express, {urlencoded} from 'express'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import notFoundMiddleware from './core/middleware/notFoundMiddleWare'
import errorHandlerMiddleWare from './core/middleware/errorHandlerMiddleWare'
import {StatusCodes} from 'http-status-codes'
import prisma from '@prisma/client'
import morgan from 'morgan'

import authRouter from './api/auth/routes/auth'
import campaignCategoryRouter from './api/campagin/routes/campaign-category'
import campaign from './api/campagin/routes/campaign'

import * as path from "path";
import campaignApplication from "./api/campagin/routes/campaign-application.js";
import authorizationMiddleWare from "./core/middleware/authorizationMiddleWare.js";

export const app = express()

if (process.env.ENVIROUMENT === 'development') {
    dotenv.config({path: 'backend/config/.env'})
} else {
    app.get('/', (req, res) => {
        res.status(StatusCodes.OK).json({message: 'Server Is Running.'})
    })
}

// Express App Config
app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(express.static('/public'))
app.use(express.static(path.join(path.resolve('./'), '..')))
app.use(cookieParser())

app.use(fileUpload({useTempFiles: true}))

app.use(morgan('combined'))


const BASE_URL = process.env.BASE_URL || 'api/v1/'
const CAMPAIGN_CATEGORY = BASE_URL + '/campaign-category'
const CAMPAIGN = BASE_URL + '/campaign'
const CAMPAIGN_APPLICATION = BASE_URL + '/campaign-application'

app.use(CAMPAIGN_CATEGORY, campaignCategoryRouter)
app.use(CAMPAIGN, campaign)
app.use(CAMPAIGN_APPLICATION,authorizationMiddleWare, campaignApplication)
app.use(BASE_URL, authRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleWare)
