import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routers/userRouter/userRouter.js";
import options from "./middlewares/cors.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";
import workoutsRouter from "./routers/workoutsRouter/workoutsRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors(options));

app.use("/user", userRouter);
app.use("/workouts", workoutsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
