import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Workout from "../../../database/models/Workout/Workout.js";

export const getWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workouts = await Workout.find().exec();

    res.status(200).json({ workouts });
  } catch (error) {
    const customError = new CustomError(
      "Bad request",
      500,
      "Couldn't find workouts"
    );

    next(customError);
  }
};
