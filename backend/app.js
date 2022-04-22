import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import notFoundMiddleware from './core/middleware/notFoundMiddleWare'
import errorHandlerMiddleWare from './core/middleware/errorHandlerMiddleWare'
import { StatusCodes } from 'http-status-codes'


import authRouter from './api/auth/routes/auth'
import campaignCategoryRouter from './api/campagin/routes/campaign-category.js'
import * as path from "path";
export const app = express()

if (process.env.ENVIROUMENT === 'development') {
    dotenv.config({ path: 'backend/config/.env' })
} else {
    app.get('/', (req, res) => {
        res.status(StatusCodes.OK).json({ message: 'Server Is Running.' })
    })
}

// App Config
app.use(express.json())
app.use(urlencoded({ extended: true }))
app.use(express.static('/public'))
app.use(express.static(path.join(path.resolve('./'), '..')))

process.env.USER_IMAGE_PATH =  `/content/images/user/`
process.env.CAMPAGIN_IMAGE_PATH =  `/content/images/campaign/`
process.env.CAMPAGIN_VIDEO_PATH =  `/content/video/campaign/`
process.env.CAMPAGIN_CATEGORY_IMAGE_PATH =  `/content/images/campaign-category/`

app.use(fileUpload({ useTempFiles: true }))
app.use(cookieParser())

const BASE_URL = process.env.BASE_URL || 'api/v1/'

const CAMPAIGN_CATEGORY = BASE_URL + '/campaign-category'

app.use(BASE_URL, authRouter)
app.use(CAMPAIGN_CATEGORY, campaignCategoryRouter)
app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleware)
