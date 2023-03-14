import { Router } from "express";
import { getWorkouts } from "../../controllers/workoutControllers/workoutControllers.js";

const workoutsRouter = Router();

workoutsRouter.get("/", getWorkouts);

export default workoutsRouter;
