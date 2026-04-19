const User = require("../Models/UserSchema");
const {
  ensureValidObjectId,
  ADDRESS_ROUTE_MESSAGE,
  INVALID_ADDRESS_PAYLOAD_MESSAGE,
  validateAndNormalizeAddresses,
  validateAndNormalizeAddress,
  validateAndNormalizeAvatar,
  validateAndNormalizeName,
  validateAndNormalizePhone,
  splitFullName,
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

  const requesterId =
    currentUser._id?.toString?.() || currentUser.id?.toString?.();
  const isAdmin =
    currentUser.role === "admin" || currentUser.role === "devAdmin";

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

const buildAddressFallbacks = (user, preferredAddress = {}) => {
  const fallbackName = splitFullName(user?.name);

  return {
    fallbackFirstName:
      preferredAddress.firstName || fallbackName.firstName || undefined,
    fallbackLastName:
      preferredAddress.lastName || fallbackName.lastName || undefined,
    fallbackPhone: preferredAddress.phone || user?.phone || undefined,
  };
};

const normalizeExistingAddresses = (user, preferredAddress = {}) => {
  const existingAddresses = Array.isArray(user?.addresses) ? user.addresses : [];

  if (existingAddresses.length === 0) {
    return [];
  }

  return validateAndNormalizeAddresses(
    existingAddresses.map((address) =>
      typeof address?.toObject === "function" ? address.toObject() : address,
    ),
    buildAddressFallbacks(user, preferredAddress),
  );
};

const coerceAddressPayload = (payload) => {
  if (Array.isArray(payload)) {
    return { mode: "replace", addresses: payload };
  }

  if (!payload || typeof payload !== "object") {
    throw new Error(INVALID_ADDRESS_PAYLOAD_MESSAGE);
  }

  if (payload.addresses !== undefined) {
    if (!Array.isArray(payload.addresses)) {
      throw new Error("Addresses must be an array");
    }

    return { mode: "replace", addresses: payload.addresses };
  }

  return { mode: "upsert", address: payload };
};

const updateUserAddresses = async (currentUser, targetUserId, payload) => {
  ensureValidObjectId(targetUserId, "user ID");
  ensureCanManageUser(currentUser, targetUserId);

  const user = await getUserOrThrow(targetUserId);
  const normalizedPayload = coerceAddressPayload(payload);
  let finalAddresses = [];

  if (normalizedPayload.mode === "replace") {
    finalAddresses = validateAndNormalizeAddresses(
      normalizedPayload.addresses,
      buildAddressFallbacks(user),
    );
  } else {
    const incomingAddress = validateAndNormalizeAddress(
      normalizedPayload.address,
      0,
      buildAddressFallbacks(user, normalizedPayload.address),
    );

    const existingAddresses = normalizeExistingAddresses(user, incomingAddress);
    const targetAddressId = String(
      normalizedPayload.address?._id || normalizedPayload.address?.id || "",
    );
    const hasTargetId = Boolean(targetAddressId);
    let incomingAddressIndex = existingAddresses.length;

    if (hasTargetId) {
      ensureValidObjectId(targetAddressId, "address ID");
    }

    let nextAddresses = hasTargetId
      ? existingAddresses.map((address, index) => {
          if (String(address._id || "") !== targetAddressId) {
            return address;
          }

          incomingAddressIndex = index;
          return { ...incomingAddress, _id: address._id };
        })
      : [...existingAddresses, incomingAddress];

    if (hasTargetId && incomingAddressIndex === existingAddresses.length) {
      throw new Error("Address not found");
    }

    if (incomingAddress.isDefault) {
      nextAddresses = nextAddresses.map((address) => ({
        ...address,
        isDefault: nextAddresses.indexOf(address) === incomingAddressIndex,
      }));
    }

    finalAddresses = validateAndNormalizeAddresses(
      nextAddresses,
      buildAddressFallbacks(user, incomingAddress),
    );
  }

  user.addresses = finalAddresses;
  await user.save();

  return buildSafeUser(user);
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserAddresses,
  buildSafeUser,
};
