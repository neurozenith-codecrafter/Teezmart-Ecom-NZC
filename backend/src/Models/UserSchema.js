const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin", "devAdmin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
    },

    addresses: {
      type: [addressSchema],
      validate: {
        validator: function (val) {
          return val.length <= 5; // max 5 addresses
        },
        message: "You can add up to 5 addresses only",
      },
    },

  },
  {
    timestamps: true,
  }
);

// // 🔒 Ensure only one default address
// userSchema.pre("save", function (next) {
//   if (this.addresses.length > 0) {
//     const defaultAddresses = this.addresses.filter(a => a.isDefault);
//     if (defaultAddresses.length > 1) {
//       return next(new Error("Only one default address allowed"));
//     }
//   }
//   next();
// });

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);