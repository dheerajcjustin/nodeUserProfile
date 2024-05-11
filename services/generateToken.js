import jwt from "jsonwebtoken";

const generateToken = (userId) => {
      try {
            const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
                  expiresIn: "30d",
            });

            return token;
      } catch (error) {
            console.log(error);
      }
};

export default generateToken;
