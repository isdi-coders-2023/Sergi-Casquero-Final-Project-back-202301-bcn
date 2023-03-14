import { Router } from "express";
import { Joi, validate } from "express-validation";
import {
  loginUser,
  registerUser,
} from "../controllers/userControllers/userControllers.js";
import loginSchema from "../schemas/loginSchema.js";
import registerSchema from "../schemas/registerSchema.js";

const userRouter = Router();

userRouter.post(
  "/register",
  validate(registerSchema, {}, { abortEarly: false }),
  registerUser
);

userRouter.post(
  "/login",
  validate(loginSchema, {}, { abortEarly: false }),
  loginUser
);

export default userRouter;
