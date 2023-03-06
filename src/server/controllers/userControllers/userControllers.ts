import { type NextFunction, type Request, type Response } from "express";
import { type UserStructure } from "./types.js";
import bcryptjs from "bcryptjs";
import User from "../../../database/models/User/User.js";
import { CustomError } from "../../../CustomError/CustomError.js";

export const createUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: `${user.username} account created!` });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Couldn't create the user"
    );

    next(customError);
  }
};
