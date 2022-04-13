import { StatusCodes } from 'http-status-codes'
import UserService from '../services/userServices'

let us = new UserService()

export const register = async (req, res, next) => {
    let newUser = us.create(req.body)
    res.status(StatusCodes.CREATED).json({ data: newUser })
}
