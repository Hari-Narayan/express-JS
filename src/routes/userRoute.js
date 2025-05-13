import { Router } from "express";

const userRouter = Router();

import {
  list,
  myProfile,
  updatePassword,
} from "../controllers/userController.js";

userRouter.get("/list", list);
userRouter.post("/my-profile", myProfile);
userRouter.post("/update-password", updatePassword);

export default userRouter;
