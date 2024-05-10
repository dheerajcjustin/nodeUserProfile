// User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const Roles = {
      admin: "admin",
      user: "user",
};

export const AccountType = {
      Public: "public",
      private: "private",
};
const userSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: true,
            },
            accountType: {
                  type: String,
                  enum: [AccountType.Public, AccountType.private],
                  default: AccountType.Public,
            },

            email: {
                  type: String,
                  required: true,
                  unique: true,
                  validate: {
                        validator: function (v) {
                              const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                              return !v || !v.trim().length || re.test(v);
                        },
                        message: "Provided email is invalid.",
                  },
            },
            password: {
                  type: String,
                  required: true,
                  select: false,
            },
            role: {
                  required: true,
                  type: String,
                  enum: [Roles.ADMIN, Roles.USER],
                  default: Roles.USER,
            },
            phone: {
                  type: String /*not required by default**/,
                  validate: {
                        validator: function (v) {
                              const re = /^\d{10}$/;
                              return !v || !v.trim().length || re.test(v);
                        },
                        message: "Provided phone number is invalid.",
                  },
            },
            bio: String,
            phone: String,
      },
      { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
      if (!this.isModified("password")) {
            return next();
      }

      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
