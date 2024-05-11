import bcrypt from "bcryptjs";

import mongoose from "mongoose";
export const Roles = {
      admin: "admin",
      user: "user",
};

export const AccountType = {
      public: "public",
      private: "private",
};

const AccountTypeEnum = [AccountType.Public, AccountType.private];

const RolesEnum = [Roles.admin, Roles.user];

const userSchema = new mongoose.Schema(
      {
            name: {
                  type: String,
                  required: true,
                  trim: true, // Trim leading/trailing whitespaces
                  validate: {
                        validator: function (v) {
                              return v && v.trim().length; // Check if trimmed value exists
                        },
                        message: "Name is required and cannot be empty.",
                  },
            },
            accountType: {
                  type: String,
                  enum: AccountTypeEnum,
                  default: AccountType.public,
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
                  enum: RolesEnum,
                  default: Roles.user,
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
            photo: String,
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

userSchema.pre("findOneAndUpdate", async function (next) {
      try {
            const update = this.getUpdate();
            if (update.password) {
                  // Hash the password before updating
                  const salt = await bcrypt.genSalt(10);

                  const hashedPassword = await bcrypt.hash(update.password, 10);
                  this.setUpdate({
                        $set: {
                              password: hashedPassword,
                        },
                  });
            }
            next();
      } catch (error) {
            next(error);
      }
});

// userSchema.pre("updateOne", async function (next) {
//       if (!this.isModified("password")) {
//             return next();
//       }

//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
// });

const User = mongoose.model("user", userSchema);

export default User;
