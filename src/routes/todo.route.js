import {Router} from "express"
const router = Router()

import {createTodo, getTodo, getById, updateTodo, deleteTodo} from "../controllers/todo.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

router.route("/todos").post(verifyJWT, createTodo)
router.route("/todos").get(verifyJWT, getTodo)
router.route("/todos/:id").get(verifyJWT, getById)
router.route("/todos/:id").put(verifyJWT, updateTodo)
router.route("/todos/:id").delete(verifyJWT, deleteTodo)

export default router