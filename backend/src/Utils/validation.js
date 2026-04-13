const mongoose = require("mongoose");

const ensureValidObjectId = (id, fieldName = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const PHONE_ERROR_MESSAGE = "Invalid phone number. Use a valid Indian mobile number";
const ADDRESS_ROUTE_MESSAGE =
  "Addresses must be updated using PUT /api/users/profile/:id/address";

const normalizeOptionalString = (value, fieldName, maxLength) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return "";
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const normalizedValue = value.trim();

  if (maxLength && normalizedValue.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }

  return normalizedValue;
};

const validateAndNormalizeName = (name) => {
  const normalizedName = normalizeOptionalString(name, "Name", 50);

  if (normalizedName === undefined) {
    return undefined;
  }

  if (normalizedName.length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  return normalizedName;
};

const validateAndNormalizeAvatar = (avatar) => {
  const normalizedAvatar = normalizeOptionalString(avatar, "Avatar", 500);

  if (normalizedAvatar === undefined) {
    return undefined;
  }

  return normalizedAvatar;
};

const validateAndNormalizePhone = (phone) => {
  if (phone === undefined) {
    return undefined;
  }

  if (phone === null) {
    return null;
  }

  if (typeof phone !== "string" && typeof phone !== "number") {
    throw new Error(PHONE_ERROR_MESSAGE);
  }

  const rawPhone = String(phone).trim();

  if (!rawPhone) {
    return null;
  }

  let normalizedPhone = rawPhone.replace(/[^\d+]/g, "");

  if (normalizedPhone.startsWith("+91")) {
    normalizedPhone = normalizedPhone.slice(3);
  } else if (normalizedPhone.startsWith("91") && normalizedPhone.length === 12) {
    normalizedPhone = normalizedPhone.slice(2);
  }

  if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
    throw new Error(PHONE_ERROR_MESSAGE);
  }

  return normalizedPhone;
};

const ADDRESS_FIELD_LIMITS = {
  street: 120,
  city: 60,
  state: 60,
  pincode: 20,
  country: 60,
};

const validateRequiredAddressField = (value, fieldName, maxLength) => {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} is required`);
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required`);
  }

  if (normalizedValue.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }

  return normalizedValue;
};

const validateAndNormalizeAddress = (address, index) => {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    throw new Error(`Address at index ${index} must be an object`);
  }

  const street = validateRequiredAddressField(
    address.street,
    "Street",
    ADDRESS_FIELD_LIMITS.street,
  );
  const city = validateRequiredAddressField(address.city, "City", ADDRESS_FIELD_LIMITS.city);
  const state = validateRequiredAddressField(
    address.state,
    "State",
    ADDRESS_FIELD_LIMITS.state,
  );
  const pincode = validateRequiredAddressField(
    address.pincode,
    "Pincode",
    ADDRESS_FIELD_LIMITS.pincode,
  );
  const country = address.country === undefined || address.country === null || address.country === ""
    ? "India"
    : validateRequiredAddressField(address.country, "Country", ADDRESS_FIELD_LIMITS.country);

  const isIndianAddress = country.toLowerCase() === "india";
  const trimmedPincode = pincode.replace(/\s+/g, "");

  if (isIndianAddress && !/^\d{6}$/.test(trimmedPincode)) {
    throw new Error("Pincode must be a valid 6-digit Indian postal code");
  }

  if (!isIndianAddress && !/^[A-Za-z0-9 -]{3,10}$/.test(pincode)) {
    throw new Error("Pincode must be 3 to 10 characters and contain only letters, numbers, spaces or hyphens");
  }

  return {
    street,
    city,
    state,
    pincode: isIndianAddress ? trimmedPincode : pincode,
    country,
    isDefault: Boolean(address.isDefault),
  };
};

const validateAndNormalizeAddresses = (addresses) => {
  if (!Array.isArray(addresses)) {
    throw new Error("Addresses must be an array");
  }

  if (addresses.length > 5) {
    throw new Error("You can add up to 5 addresses only");
  }

  const normalizedAddresses = addresses.map((address, index) =>
    validateAndNormalizeAddress(address, index),
  );
  const defaultCount = normalizedAddresses.filter((address) => address.isDefault).length;

  if (defaultCount > 1) {
    throw new Error("Only one address can be default");
  }

  if (defaultCount === 0 && normalizedAddresses.length > 0) {
    normalizedAddresses[0].isDefault = true;
  }

  return normalizedAddresses;
};

module.exports = {
  ensureValidObjectId,
  PHONE_ERROR_MESSAGE,
  ADDRESS_ROUTE_MESSAGE,
  validateAndNormalizeName,
  validateAndNormalizeAvatar,
  validateAndNormalizePhone,
  validateAndNormalizeAddresses,
  validateAndNormalizeAddress
};
