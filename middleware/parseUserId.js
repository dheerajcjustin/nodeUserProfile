import mongoose from "mongoose";

const parseUserId = (req, res, next) => {
      const { userId } = req.params; // Use teamId consistently

      if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ error: "user  does not exits" });
      }

      try {
            req.userId = mongoose.Types.ObjectId.createFromHexString(userId);
            next();
      } catch (error) {
            // Handle potential conversion errors (e.g., invalid string)
            console.error("Error converting team ID to ObjectId:", error);
            return res.status(404).json({ error: "user  does not exits" });
      }
};

export default parseUserId;
