import User from "../models/User";
import generateToken from "../services/generateToken";
import tryCatch from "../services/tryCatch";

export const login = tryCatch(async (req, res, next) => {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      const isMatchPassword = await user.matchPassword(password);

      if (user && isMatchPassword) {
            const token = generateToken(res, user._id);

            res.cookie("jwt", token, {
                  httpOnly: true,
                  // secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
                  // sameSite: "strict", // Prevent CSRF attacks
                  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });
            res.cookie("myCookie", "cookieValue", {
                  maxAge: 30 * 24 * 60 * 60 * 1000,
                  // httpOnly: true,
            });

            res.send({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  subscriptions: user.subscriptions,
            });
      } else {
            res.status(401);
            throw new Error("Invalid email or password");
      }
});

export const signUp = tryCatch(async (req, res, next) => {
      const { name, email, password } = req.body;

      const userExists = await User.findOne({ email });

      if (userExists) {
            res.status(409);
            throw new Error("User already exists");
      }

      const user = await User.create({
            name,
            email,
            password,
      });

      if (user) {
            const token = generateToken(user._id);
            res.cookie("jwt", token, {
                  httpOnly: true,
                  //   secure: process.env.NODE_ENV !== "development", // Use secure cookies in production
                  //   sameSite: "strict", // Prevent CSRF attacks
                  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            res.status(201).json({
                  _id: user._id,
                  name: user.name,
                  email: user.email,
                  role: user.role,
            });
      } else {
            res.status(400);
            throw new Error("Invalid user data");
      }
});

export const logout = (req, res, next) => {
      res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
      });
      res.status(200).json({ message: "Logged out successfully" });
};
