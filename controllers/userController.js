// import User, { Roles, AccountType } from "../models/User.js";
import tryCatch from "../services/tryCatch.js";
import handleUpload, { fileDelete } from "../services/fileUpload.js";
import User, { AccountType } from "../models/User.js";

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

      const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            {
                  new: true,
            }
      );

      res.send(user);
});

export const updateProfilePic = tryCatch(async (req, res, next) => {
      try {
            const { _id: userId } = req.user;

            const b64 = Buffer.from(req.file.buffer).toString("base64");
            let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            const { url, public_id } = await handleUpload(dataURI);

            const user = await User.findByIdAndUpdate(
                  userId,
                  { $set: { photo: { url, photoId: public_id } } },
                  {
                        new: true,
                  }
            );

            fileDelete(req?.user?.photo);

            res.json(user);
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

      const filter = isAdmin ? {} : { accountType: AccountType.public };

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
            : { _id: req.userId, accountType: AccountType.public };

      const user = await User.findOne(filter);

      if (user) return res.send(user);

      return res.status(404).json({ error: "not found" });
});
