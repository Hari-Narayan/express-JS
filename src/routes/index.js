import { Router } from "express";

import authRouter from "./authRoute.js";
import userRouter from "./userRoute.js";
import auth from "../middlewares/authMiddleware.js";
// Importing the routers

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  res.send("You are on base API route!");
});

rootRouter.use("/auth", authRouter);
rootRouter.use("/user", auth, userRouter);
// Define the routes

export default rootRouter;
