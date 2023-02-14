import express from "express"
import { postRouter } from "./post"
import { userRouter } from "./user"


export const routers = () => {
    const router = express.Router()

    postRouter(router)
    userRouter(router)

    return router
}