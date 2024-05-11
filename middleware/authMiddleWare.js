import jwt from "jsonwebtoken";
import tryCatch from "../services/tryCatch.js";
import User, { Roles } from "../models/User.js";

const authMiddleWare = tryCatch(async (req, res, next) => {
      let token;

      token = req.cookies.jwt;

      const { isAdmin } = req.query;

      if (isAdmin) {
            return next();
      }

      if (token) {
            try {
                  const decoded = jwt.verify(token, process.env.JWT_SECRET);

                  const user = await User.findById(decoded.userId);

                  req.user = user;
                  req.isAdmin = req?.user?.role === Roles.admin;

                  next();
            } catch (error) {
                  console.error(error);
                  res.status(401);
                  throw new Error("Not authorized, token failed");
            }
      } else {
            res.status(401);
            throw new Error("Not authorized, no token");
      }
});

export default authMiddleWare;
