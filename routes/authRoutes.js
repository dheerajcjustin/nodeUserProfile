import { Router } from "express";
import { login, logout, signUp } from "../controllers/authController";

const authRouter = Router();

authRouter.post("login", login);
authRouter.post("singUp", signUp);
authRouter.get("logOut", logout);
