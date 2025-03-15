import { Router } from "express";
const router = Router()

import {registration, login, logout} from "../controllers/user.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

router.route("/registartion").post(registration)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT, logout)



export default router