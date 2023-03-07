import { Router } from "express";
import { registerUser } from "../controllers/userControllers/userControllers.js";

const userRouter = Router();

userRouter.post("/register", registerUser);

export default userRouter;
