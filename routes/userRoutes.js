import { Router } from "express";

import {
      changePassword,
      getProfile,
      getUser,
      getUserById,
      updateProfile,
      updateProfilePic,
} from "../controllers/userController.js";
import { uploadMulter } from "../services/fileUpload.js";
import parseUserId from "../middleware/parseUserId.js";
import authMiddleWare from "../middleware/authMiddleWare.js";

const userRouter = Router();

userRouter.use(authMiddleWare);
userRouter.route("/profile").get(getProfile).patch(updateProfile);

userRouter.post(
      "/profileUpload",
      uploadMulter.single("profilePic"),
      updateProfilePic
);

userRouter.post("/changePassword", changePassword);

userRouter.get("/", getUser);
userRouter.get("/:userId", parseUserId, getUserById);

export default userRouter;
