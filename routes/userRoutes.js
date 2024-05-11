import { Router } from "express";

import {
      getProfile,
      getUser,
      getUserById,
      updateProfile,
      updateProfilePic,
} from "../controllers/userController.js";
import { uploadMulter } from "../services/fileUpload.js";
import parseUserId from "../middleware/parseUserId.js";

const userRouter = Router();

userRouter.route("/profile").get(getProfile).patch(updateProfile);

userRouter.post(
      "profileUpload",
      uploadMulter.single("profilePic"),
      updateProfilePic
);

userRouter.get("/", getUser);
userRouter.get("/:userId", parseUserId, getUserById);

export default userRouter;
