const User = require("../Models/UserSchema");
const {
  ensureValidObjectId,
  ADDRESS_ROUTE_MESSAGE,
  validateAndNormalizeAddresses,
  validateAndNormalizeAvatar,
  validateAndNormalizeName,
  validateAndNormalizePhone,
} = require("../Utils/validation");
const { buildSafeUser } = require("../Utils/userResponse");

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

const ensureCanManageUser = (currentUser, targetUserId) => {
  if (!currentUser) {
    throw new Error("Not authorized");
  }

  const requesterId = currentUser._id?.toString?.() || currentUser.id?.toString?.();
  const isAdmin = currentUser.role === "admin" || currentUser.role === "devAdmin";

  if (!isAdmin && requesterId !== targetUserId) {
    throw new Error("Unauthorized");
  }
};

const getUserProfile = async (userId) => {
  const user = await getUserOrThrow(userId);
  return buildSafeUser(user);
};

const updateUserProfile = async (userId, payload) => {
  const user = await getUserOrThrow(userId);
  const { name, phone, avatar, addresses, ...unexpectedFields } = payload || {};

  if (addresses !== undefined) {
    throw new Error(ADDRESS_ROUTE_MESSAGE);
  }

  if (Object.keys(unexpectedFields).length > 0) {
    throw new Error("Only name, phone and avatar can be updated in profile");
  }

  const normalizedName = validateAndNormalizeName(name);
  const normalizedPhone = validateAndNormalizePhone(phone);
  const normalizedAvatar = validateAndNormalizeAvatar(avatar);

  if (normalizedName !== undefined) {
    user.name = normalizedName;
  }

  if (normalizedPhone !== undefined) {
    user.phone = normalizedPhone === null ? undefined : normalizedPhone;
  }

  if (normalizedAvatar !== undefined) {
    user.avatar = normalizedAvatar;
  }

  await user.save();

  return buildSafeUser(user);
};

const updateUserAddresses = async (currentUser, targetUserId, payload) => {
  ensureValidObjectId(targetUserId, "user ID");
  ensureCanManageUser(currentUser, targetUserId);

  const user = await getUserOrThrow(targetUserId);
  const rawAddresses = Array.isArray(payload) ? payload : payload?.addresses;

  if (rawAddresses === undefined) {
    throw new Error("Addresses are required");
  }

  user.addresses = validateAndNormalizeAddresses(rawAddresses);
  await user.save();

  return buildSafeUser(user);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
  buildSafeUser,
};
