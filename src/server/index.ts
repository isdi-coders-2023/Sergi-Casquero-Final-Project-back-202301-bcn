import express from "express";
import morgan from "morgan";
import cors from "cors";
import options from "../middlewares/cors.js";
import userRouter from "./routers/userRouter.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());
app.use(morgan("dev"));
app.use(cors(options));

app.use("/user", userRouter);

export default app;
