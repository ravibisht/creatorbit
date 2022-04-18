import express, { urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import 'express-async-errors'
import fileUpload from 'express-fileupload'
import dotenv from 'dotenv'
import notFoundMiddleware from './core/middleware/notFoundMiddleWare'
import errorHandlerMiddleWare from './core/middleware/errorHandlerMiddleWare'
import { StatusCodes } from 'http-status-codes'

import authRouter from './api/auth/routes/auth'
export const app = express()

if (process.env.ENVIROUMENT === 'develjopment') {
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
app.use(fileUpload())
app.use(cookieParser())

const BASE_URL = process.env.BASE_URL || '/v1/api'

app.use(BASE_URL, authRouter)
console.log(BASE_URL)
app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleware)
