import { Router } from "express";
import {
  loginUser,
  registerUser,
} from "../controllers/userControllers/userControllers.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
