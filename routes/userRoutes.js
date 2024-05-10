import { Router } from "express";

import { updateProfile } from "../controllers/userController.js";

const userRouter = Router();

userRouter.patch("/profile", updateProfile);

export default router;
