import { Router } from "express";
import { createUser } from "../controllers/userControllers/userControllers.js";

const userRouter = Router();

userRouter.post("/register", createUser);

export default userRouter;
