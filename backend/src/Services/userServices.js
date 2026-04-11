const User = require("../Models/UserSchema");
const { ensureValidObjectId } = require("../Utils/validation");
const { buildSafeUser } = require("../Utils/userResponse");

const validateAddresses = (addresses) => {
  if (!Array.isArray(addresses)) {
    throw new Error("Addresses must be an array");
  }

  if (addresses.length > 5) {
    throw new Error("You can add up to 5 addresses only");
  }

  const defaultCount = addresses.filter((address) => address.isDefault).length;

  if (defaultCount > 1) {
    throw new Error("Only one address can be default");
  }

  if (defaultCount === 0 && addresses.length > 0) {
    addresses[0].isDefault = true;
  }

  return addresses;
};

const getUserOrThrow = async (userId) => {
  ensureValidObjectId(userId, "user ID");

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.isActive) {
    throw new Error("Account is deactivated");
  }

  return user;
};

const getUserProfile = async (userId) => {
  const user = await getUserOrThrow(userId);
  return buildSafeUser(user);
};

const updateUserProfile = async (userId, payload) => {
  const user = await getUserOrThrow(userId);
  const { name, phone, avatar, addresses } = payload;

  if (name !== undefined) {
    user.name = name;
  }

  if (phone !== undefined) {
    user.phone = phone;
  }

  if (avatar !== undefined) {
    user.avatar = avatar;
  }

  if (addresses !== undefined) {
    user.addresses = validateAddresses(addresses);
  }

  await user.save();

  return buildSafeUser(user);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  buildSafeUser,
};
