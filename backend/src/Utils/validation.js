const mongoose = require("mongoose");

const ensureValidObjectId = (id, fieldName = "ID") => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${fieldName}`);
  }
};

const PHONE_ERROR_MESSAGE = "Invalid phone number. Use a valid Indian mobile number";
const ADDRESS_ROUTE_MESSAGE =
  "Addresses must be updated using PUT /api/users/profile/:id/address";
const INVALID_ADDRESS_PAYLOAD_MESSAGE = "Address payload is invalid";
const MAX_USER_ADDRESSES = 5;

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
  firstName: 50,
  lastName: 50,
  addressLine1: 120,
  addressLine2: 120,
  landmark: 120,
  city: 60,
  state: 60,
  pincode: 20,
  country: 60,
};

const splitFullName = (fullName) => {
  if (typeof fullName !== "string") {
    return { firstName: "", lastName: "" };
  }

  const normalizedName = fullName.trim().replace(/\s+/g, " ");

  if (!normalizedName) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = normalizedName.split(" ");

  return {
    firstName,
    lastName: rest.join(" "),
  };
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

const validateOptionalAddressField = (value, fieldName, maxLength) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return undefined;
  }

  if (normalizedValue.length > maxLength) {
    throw new Error(`${fieldName} cannot exceed ${maxLength} characters`);
  }

  return normalizedValue;
};

const normalizeAddressIdentity = ({
  address,
  fallbackFirstName,
  fallbackLastName,
}) => {
  const nameFromFullName = splitFullName(address.fullName);
  const nameFromFallback = splitFullName(
    [fallbackFirstName, fallbackLastName].filter(Boolean).join(" "),
  );

  const firstName = validateRequiredAddressField(
    address.firstName ||
      nameFromFullName.firstName ||
      fallbackFirstName ||
      nameFromFallback.firstName,
    "First name",
    ADDRESS_FIELD_LIMITS.firstName,
  );

  const lastName = validateRequiredAddressField(
    address.lastName ||
      nameFromFullName.lastName ||
      fallbackLastName ||
      nameFromFallback.lastName,
    "Last name",
    ADDRESS_FIELD_LIMITS.lastName,
  );

  return {
    firstName,
    lastName,
  };
};

const normalizeAddressPhone = (phone, fallbackPhone) => {
  const normalizedPhone = validateAndNormalizePhone(phone ?? fallbackPhone);

  if (!normalizedPhone) {
    throw new Error("Phone is required");
  }

  return normalizedPhone;
};

const validateAndNormalizeAddress = (address, index, options = {}) => {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    throw new Error(`Address at index ${index} must be an object`);
  }

  const {
    fallbackPhone,
    fallbackFirstName,
    fallbackLastName,
    preserveId = true,
  } = options;

  const { firstName, lastName } = normalizeAddressIdentity({
    address,
    fallbackFirstName,
    fallbackLastName,
  });

  const phone = normalizeAddressPhone(address.phone, fallbackPhone);

  const derivedAddressLine1 =
    address.addressLine1 ?? address.house ?? address.addressLine ?? address.street;
  const derivedAddressLine2 =
    address.addressLine2 ?? (address.house ? address.street : undefined);

  const addressLine1 = validateRequiredAddressField(
    derivedAddressLine1,
    "Address line 1",
    ADDRESS_FIELD_LIMITS.addressLine1,
  );

  const addressLine2 = validateOptionalAddressField(
    derivedAddressLine2,
    "Address line 2",
    ADDRESS_FIELD_LIMITS.addressLine2,
  );

  const landmark = validateOptionalAddressField(
    address.landmark,
    "Landmark",
    ADDRESS_FIELD_LIMITS.landmark,
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

  const normalizedAddress = {
    firstName,
    lastName,
    phone,
    addressLine1,
    ...(addressLine2 ? { addressLine2 } : {}),
    ...(landmark ? { landmark } : {}),
    city,
    state,
    pincode: isIndianAddress ? trimmedPincode : pincode,
    country,
    isDefault: Boolean(address.isDefault),
  };

  const rawId = address._id || address.id;

  if (preserveId && rawId && mongoose.Types.ObjectId.isValid(rawId)) {
    normalizedAddress._id = new mongoose.Types.ObjectId(rawId);
  }

  return normalizedAddress;
};

const normalizeDefaultAddressSelection = (addresses) => {
  const defaultIndexes = [];

  addresses.forEach((address, index) => {
    if (address.isDefault) {
      defaultIndexes.push(index);
    }
  });

  if (defaultIndexes.length > 1) {
    throw new Error("Only one address can be default");
  }

  if (defaultIndexes.length === 0 && addresses.length > 0) {
    addresses[0].isDefault = true;
  }

  return addresses;
};

const validateAndNormalizeAddresses = (addresses, options = {}) => {
  if (!Array.isArray(addresses)) {
    throw new Error("Addresses must be an array");
  }

  if (addresses.length > MAX_USER_ADDRESSES) {
    throw new Error("You can add up to 5 addresses only");
  }

  const normalizedAddresses = addresses.map((address, index) =>
    validateAndNormalizeAddress(address, index, options),
  );

  return normalizeDefaultAddressSelection(normalizedAddresses);
};

const normalizeShippingAddress = (shippingAddress, options = {}) => {
  if (
    !shippingAddress ||
    typeof shippingAddress !== "object" ||
    Array.isArray(shippingAddress)
  ) {
    throw new Error("Shipping address is required");
  }

  const normalizedAddress = validateAndNormalizeAddress(
    shippingAddress,
    0,
    { ...options, preserveId: false },
  );

  const { isDefault, _id, ...orderAddress } = normalizedAddress;

  return orderAddress;
};

const isAddressValidationErrorMessage = (message = "") => {
  return (
    message === INVALID_ADDRESS_PAYLOAD_MESSAGE ||
    message === "Shipping address is required" ||
    message === "Addresses must be an array" ||
    message === "Only one address can be default" ||
    message === "You can add up to 5 addresses only" ||
    message === "Pincode must be a valid 6-digit Indian postal code" ||
    message ===
      "Pincode must be 3 to 10 characters and contain only letters, numbers, spaces or hyphens" ||
    /^Address at index \d+ must be an object$/.test(message) ||
    / is required$/.test(message) ||
    / must be a string$/.test(message) ||
    / cannot exceed \d+ characters$/.test(message) ||
    message === PHONE_ERROR_MESSAGE
  );
};

module.exports = {
  ensureValidObjectId,
  PHONE_ERROR_MESSAGE,
  ADDRESS_ROUTE_MESSAGE,
  INVALID_ADDRESS_PAYLOAD_MESSAGE,
  MAX_USER_ADDRESSES,
  validateAndNormalizeName,
  validateAndNormalizeAvatar,
  validateAndNormalizePhone,
  validateAndNormalizeAddresses,
  validateAndNormalizeAddress,
  normalizeShippingAddress,
  splitFullName,
  isAddressValidationErrorMessage,
};
