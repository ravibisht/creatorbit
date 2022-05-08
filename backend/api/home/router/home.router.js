import {homeView} from "../controller/home.controller.js";
import {Router} from "express";
const  router = Router()

router.route('/').get(homeView)

export default router