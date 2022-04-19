import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import notFoundMiddleware from './core/middleware/notFoundMiddleWare'
import errorHandlerMiddleWare from './core/middleware/errorHandlerMiddleWare'
import { StatusCodes } from 'http-status-codes'

import authRouter from './api/auth/routes/auth'
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
app.use(express.static('../content'))
process.env.USER_IMAGE_PATH =  `/content/images/user/`
app.use(fileUpload({ useTempFiles: true }))
app.use(cookieParser())

const BASE_URL = process.env.BASE_URL || '/v1/api'

app.use(BASE_URL, authRouter)
console.log(BASE_URL)
app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleware)
