// import User, { Roles, AccountType } from "../models/User.js";
import tryCatch from "../services/tryCatch.js";
import handleUpload from "../services/fileUpload.js";
import User from "../models/User.js";

export const getProfile = tryCatch(async (req, res, next) => {
      const { _id: userId } = req.user;
      const user = await User.findById(userId);

      res.send(user);
});

export const updateProfile = tryCatch(async (req, res, next) => {
      const { _id: userId } = req.user;

      const { name, bio, phone, email, password, accountType } = req.body;

      const updateFields = {};
      if (name) updateFields.name = name;
      if (bio) updateFields.bio = bio;
      if (phone) updateFields.phone = phone;
      if (email) updateFields.email = email;
      if (password) updateFields.password = password;
      if (accountType) updateFields.accountType = accountType;

      const user = await User.findByIdAndUpdate(userId, updateFields, {
            new: true,
      });

      res.send(user);
});

export const updateProfilePic = tryCatch(async (req, res, next) => {
      try {
            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const cldRes = await handleUpload(dataURI);
            res.json(cldRes);
      } catch (error) {
            console.log(error);
            res.send({
                  message: error.message,
            });
      }
});

export const getUser = tryCatch(async (req, res, next) => {
      const { isAdmin } = req;
      const { page = 1, pageSize = 10 } = req.query;

      const filter = isAdmin ? {} : { accountType: AccountType.Public };

      const skip = (page - 1) * pageSize;
      const users = await User.find(filter, null, {
            skip,
            limit: pageSize,
      });

      const totalCount = await User.countDocuments(filter);

      const response = {
            users,
            pagination: {
                  page,
                  pageSize,
                  totalCount,
            },
      };

      res.send(response);
});

export const getUserById = tryCatch(async (req, res, next) => {
      const { isAdmin } = req;
      const filter = isAdmin
            ? { _id: req.userId }
            : { _id: req.userId, accountType: AccountType.Public };

      const user = await User.findOne(filter);

      if (user) return res.send(user);

      return res.status(404).json({ error: "not found" });
});
